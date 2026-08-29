const { execFile } = require("child_process");
const { promisify } = require("util");
const path = require("path");
const fs = require("fs/promises");

const execFileAsync = promisify(execFile);
const MAX_BUFFER = 10 * 1024 * 1024;

function buildBobCommand(argumentsForBob) {
    const defaultWindowsBobPath = process.env.APPDATA
        ? path.join(process.env.APPDATA, "npm", "bob.ps1")
        : "bob";
    const bobPath = process.env.BOB_PATH || (
        process.platform === "win32" ? defaultWindowsBobPath : "bob"
    );

    // npm installs Bob as bob.ps1 on Windows. A .ps1 file cannot be spawned
    // directly by execFile, so PowerShell hosts the script without using a shell string.
    if (process.platform === "win32" && bobPath.toLowerCase().endsWith(".ps1")) {
        return {
            command: process.env.POWERSHELL_PATH || "powershell.exe",
            args: [
                "-NoLogo",
                "-NoProfile",
                "-NonInteractive",
                "-ExecutionPolicy",
                "Bypass",
                "-File",
                bobPath,
                ...argumentsForBob,
            ],
        };
    }

    return { command: bobPath, args: argumentsForBob };
}

function parseBobJson(stdout) {
    const output = String(stdout || "").replace(/^\uFEFF/, "").trim();
    if (!output) {
        throw new Error("IBM Bob returned an empty response while JSON output was expected.");
    }

    try {
        return JSON.parse(output);
    } catch (cause) {
        const error = new Error(`IBM Bob returned invalid JSON: ${cause.message}`);
        error.cause = cause;
        throw error;
    }
}

function logBobFailure(error) {
    console.error("IBM Bob invocation failed", {
        exitCode: typeof error.code === "number" ? error.code : null,
        stdout: error.stdout || "",
        stderr: error.stderr || "",
        message: error.message,
    });
}

async function runBob(prompt, workspace) {
    if (!process.env.BOB_API_KEY) {
        const error = new Error("IBM Bob is not configured. Set BOB_API_KEY in Backend/.env.");
        error.statusCode = 503;
        throw error;
    }

    const bobArguments = [
        "run",
        "--format",
        "json",
        "--max-cost",
        process.env.BOB_MAX_COST || "0.50",
        "--workspace",
        workspace,
        prompt,
    ];
    const { command, args } = buildBobCommand(bobArguments);

    try {
        const { stdout } = await execFileAsync(command, args, {
            env: process.env,
            windowsHide: true,
            maxBuffer: MAX_BUFFER,
            timeout: Number(process.env.BOB_TIMEOUT_MS || 120000),
        });
        return parseBobJson(stdout);
    } catch (error) {
        logBobFailure(error);
        if (error.code === "ENOENT") {
            error.message = "IBM Bob command was not found. Set BOB_PATH to the Bob executable or bob.ps1 path in Backend/.env.";
            error.statusCode = 503;
        }
        throw error;
    }
}

async function generateDocumentation(workspace, repositoryContext) {
    if (!repositoryContext?.sourceFiles?.length) {
        const error = new Error("Repository context contains no source files for AI analysis.");
        error.statusCode = 422;
        throw error;
    }

    await fs.writeFile(
        path.join(workspace, ".cortex-repository-context.json"),
        JSON.stringify(repositoryContext),
        "utf8"
    );

    const prompt = `You are an expert software documentation engineer and senior code analyst. Analyze the software repository in the workspace and generate accurate technical documentation based ONLY on its actual contents.

The file .cortex-repository-context.json is the authoritative structured context built from the cloned GitHub repository. It contains the preserved repository structure and actual contents of the scanned source files. Read it before analyzing. Do not use examples, assumptions, or data that is not present in that context.

STRICT RULES:
1. Never invent information. If something cannot be determined, state "Not found in the repository."
2. Do not modify repository files.
3. Ignore node_modules, build/dist folders, generated files, binaries, and caches.
4. Prefer source code and configuration files as evidence; cross-check information when possible.
5. Return ONLY valid JSON with this exact top-level shape:
{
  "projectOverview": "",
  "technologiesUsed": [],
  "projectStructure": [],
  "importantFiles": [],
  "importantFunctionsAndComponents": [],
  "apiAndBackendInformation": [],
  "databaseInformation": [],
  "authenticationInformation": [],
  "setupInstructions": [],
  "howTheProjectWorks": [],
  "importantDependencies": [],
  "dataFlow": [],
  "configurationAndEnvironmentVariables": [],
  "potentialImportantNotes": []
}

For importantFiles include file path, purpose, and important logic. For functions/components include name, file, purpose, and behavior. For APIs include method, endpoint, purpose, request/response data, and related file. For dependencies include package, purpose, and usage. Explain the confirmed data flow and only provide setup steps supported by the repository.`;

    return runBob(prompt, workspace);
}

async function analyzeRepository(workspace, repositoryContext) {
    return generateDocumentation(workspace, repositoryContext);
}

module.exports = { runBob, generateDocumentation, analyzeRepository };
