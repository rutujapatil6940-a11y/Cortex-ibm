const { spawn } = require("child_process");

const executable = process.argv[2];
const timeoutMs = 15_000;

if (!executable) {
    console.error("Bob Shell executable path is required.");
    process.exitCode = 1;
    return;
}

const child = spawn(executable, ["--version"], {
    stdio: ["ignore", "pipe", "pipe"],
    windowsHide: true,
});
const stdout = [];
const stderr = [];
let settled = false;
let timedOut = false;
let forceKillTimer;

function finish(code) {
    if (settled) return;
    settled = true;
    clearTimeout(timer);
    clearTimeout(forceKillTimer);
    child.stdout.destroy();
    child.stderr.destroy();
    process.exitCode = code;
}

const timer = setTimeout(() => {
    timedOut = true;
    child.kill("SIGTERM");
    console.error("Bob Shell version check timed out.");
    forceKillTimer = setTimeout(() => {
        child.kill("SIGKILL");
    }, 1_000);
}, timeoutMs);

child.stdout.on("data", (chunk) => stdout.push(chunk));
child.stderr.on("data", (chunk) => stderr.push(chunk));
child.once("error", (error) => {
    console.error(`Bob Shell version check failed to start: ${error.code || error.message}`);
    finish(1);
});
child.once("exit", (exitCode, signal) => {
    const version = Buffer.concat(stdout).toString("utf8").trim();
    if (timedOut) {
        finish(1);
        return;
    }

    if (exitCode === 0 && version) {
        console.log(`Bob Shell verified: ${version.split(/\r?\n/)[0]}`);
        finish(0);
        return;
    }

    const stderrPreview = Buffer.concat(stderr).toString("utf8").trim().slice(0, 500);
    console.error(`Bob Shell version check failed: exitCode=${exitCode}, signal=${signal || "none"}`);
    if (stderrPreview) console.error(stderrPreview);
    finish(1);
});
