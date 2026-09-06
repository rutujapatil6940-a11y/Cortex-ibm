const express = require("express");
const { spawn } = require("child_process");
const fs = require("fs/promises");
const os = require("os");
const path = require("path");

const app = express();

app.use(express.json({ limit: "20mb" }));

const PORT = 5001;

const BOB =
    "C:\\Users\\Shrihari H Kulkarni\\AppData\\Roaming\\npm\\bob.cmd";

app.get("/health", (req, res) => {
    res.json({
        ok: true,
        service: "cortex-bob",
        bob: "2.0.1",
    });
});

app.post("/analyze", async (req, res) => {
    const { repositoryContext, prompt } = req.body;

    if (!repositoryContext || !prompt) {
        return res.status(400).json({
            error: "repositoryContext and prompt are required",
        });
    }

    const workspace = await fs.mkdtemp(
        path.join(os.tmpdir(), "cortex-bob-")
    );

    try {
        await fs.writeFile(
            path.join(workspace, ".cortex-analysis-context.json"),
            JSON.stringify(repositoryContext),
            "utf8"
        );

        console.log("Starting local Bob analysis...");

        const result = await runBob(prompt, workspace);

        console.log(
            "BOB RAW RESULT:",
            JSON.stringify(result, null, 2)
        );

        console.log("Local Bob analysis completed.");

        res.json({
            success: true,
            result,
        });
    } catch (error) {
        console.error("Local Bob analysis failed:", error);

        res.status(500).json({
            success: false,
            error: error.message,
        });
    } finally {
        await fs.rm(workspace, {
            recursive: true,
            force: true,
        }).catch(() => {});
    }
});

function runBob(prompt, workspace) {
    return new Promise((resolve, reject) => {
        const strictPrompt = prompt;

        const args = [
            "run",
            "--format",
            "json",
            "--mode",
            "ask",
            "--workspace",
            workspace,
        ];

        if (process.env.BOB_TEAM_ID) {
            args.push("--team-id", process.env.BOB_TEAM_ID);
        }

        args.push(
            "--max-cost",
            "0.50",
            "--max-turns",
            "10",
            "--disable-mcp",
            "--disable-subagents",
            "--disable-tool-groups",
            "execute",
            "--accept-license",
            "--trust",
            "--log-level",
            "warn",
            strictPrompt
        );

        const child = spawn(
            process.env.ComSpec ||
                "C:\\Windows\\System32\\cmd.exe",
            ["/d", "/c", "call", BOB, ...args],
            {
                cwd: workspace,
                env: {
                    ...process.env,
                    BOB_API_KEY: process.env.BOB_API_KEY,
                },
                stdio: ["ignore", "pipe", "pipe"],
                windowsHide: true,
                shell: false,
            }
        );

        let stdout = "";
        let stderr = "";

        
        child.stdout.on("data", (data) => {
            stdout += data.toString();
        });

        child.stderr.on("data", (data) => {
            stderr += data.toString();
        });

        child.on("error", reject);

        const timeout = setTimeout(() => {
            child.kill();
            reject(new Error("Bob analysis timed out."));
        }, 300000);

        child.on("exit", (code, signal) => {
            clearTimeout(timeout);

            if (code !== 0) {
                return reject(
                    new Error(
                        `Bob exited with code ${code}, signal ${signal}: ${stderr.slice(
                            0,
                            2000
                        )}`
                    )
                );
            }

            try {
                resolve(JSON.parse(stdout));
            } catch {
                reject(
                    new Error(
                        `Bob returned invalid JSON: ${stdout.slice(
                            0,
                            2000
                        )}`
                    )
                );
            }
        });
    });
}

app.listen(PORT, "127.0.0.1", () => {
    console.log(
        `Cortex Bob local service running at http://127.0.0.1:${PORT}`
    );
});