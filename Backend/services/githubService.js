const fs = require("fs/promises");
const path = require("path");
const { execFile } = require("child_process");
const { promisify } = require("util");

const execFileAsync = promisify(execFile);
const CLONE_OUTPUT_MAX_BYTES = 1024 * 1024;

function createCloneError(error) {
    const stderr = String(error.stderr || "");
    const combinedMessage = `${error.message || ""}\n${stderr}`;

    if (error.code === "ETIMEDOUT" || error.killed) {
        const timeoutError = new Error("Cloning the GitHub repository timed out.");
        timeoutError.statusCode = 504;
        return timeoutError;
    }

    if (error.code === "ENOENT") {
        const gitUnavailableError = new Error("Git is not available on the server.");
        gitUnavailableError.statusCode = 503;
        return gitUnavailableError;
    }

    if (error.code === "ENOSPC") {
        const capacityError = new Error("The server does not have enough temporary storage to clone this repository.");
        capacityError.statusCode = 507;
        return capacityError;
    }

    if (["EACCES", "EPERM", "EROFS"].includes(error.code)) {
        const filesystemError = new Error("The server could not prepare temporary storage for this repository.");
        filesystemError.statusCode = 500;
        return filesystemError;
    }

    if (/repository not found|authentication failed|could not read username/i.test(combinedMessage)) {
        const notFoundError = new Error("The GitHub repository was not found or is not public.");
        notFoundError.statusCode = 404;
        return notFoundError;
    }

    const cloneError = new Error("Unable to clone the GitHub repository.");
    cloneError.statusCode = 502;
    return cloneError;
}

function parseGitHubRepositoryUrl(value) {
    const repositoryUrl = String(value || "").trim();
    let url;
    try {
        url = new URL(repositoryUrl);
    } catch {
        return null;
    }

    const parts = url.pathname.split("/").filter(Boolean);
    if (url.protocol !== "https:" || url.hostname.toLowerCase() !== "github.com" || parts.length !== 2) {
        return null;
    }

    const [owner, rawRepository] = parts;
    const repository = rawRepository.replace(/\.git$/i, "");
    if (!owner || !repository) return null;

    return {
        owner,
        repository,
        repositoryUrl: `https://github.com/${owner}/${repository}`,
    };
}

async function cloneGitHubRepository(repositoryUrl, workspace, workspaceId) {
    const repository = parseGitHubRepositoryUrl(repositoryUrl);
    if (!repository) {
        const urlError = new Error("Provide a valid HTTPS GitHub repository URL in the form https://github.com/owner/repository.");
        urlError.statusCode = 400;
        throw urlError;
    }

    console.log("GitHub repository clone started", {
        repositoryUrl: repository.repositoryUrl,
        workspaceId,
    });

    try {
        await fs.mkdir(workspace, { recursive: true });
        await execFileAsync(
            "git",
            ["clone", "--depth", "1", "--single-branch", "--", repository.repositoryUrl, workspace],
            {
                env: { ...process.env, GIT_TERMINAL_PROMPT: "0" },
                maxBuffer: CLONE_OUTPUT_MAX_BYTES,
                timeout: Number(process.env.GITHUB_CLONE_TIMEOUT_MS || 120000),
                windowsHide: true,
            }
        );
    } catch (error) {
        const cloneError = createCloneError(error);
        console.error("GitHub repository clone failed", {
            repositoryUrl: repository.repositoryUrl,
            workspaceId,
            message: cloneError.message,
        });
        throw cloneError;
    }

    console.log("GitHub repository clone successful", {
        repositoryUrl: repository.repositoryUrl,
        workspaceId,
    });
}

async function getDefaultBranch(workspace) {
    try {
        const { stdout } = await execFileAsync("git", ["branch", "--show-current"], { cwd: workspace, windowsHide: true });
        return stdout.trim() || undefined;
    } catch {
        return undefined;
    }
}

module.exports = { parseGitHubRepositoryUrl, cloneGitHubRepository, getDefaultBranch };
