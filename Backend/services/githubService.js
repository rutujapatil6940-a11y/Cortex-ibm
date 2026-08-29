const fs = require("fs/promises");
const path = require("path");
const { execFile } = require("child_process");
const { promisify } = require("util");

const execFileAsync = promisify(execFile);

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

async function cloneGitHubRepository(repositoryUrl, workspace) {
    await fs.mkdir(workspace, { recursive: true });
    try {
        await execFileAsync(
            "git",
            ["clone", "--depth", "1", "--single-branch", repositoryUrl, workspace],
            { timeout: Number(process.env.GITHUB_CLONE_TIMEOUT_MS || 120000), windowsHide: true }
        );
    } catch (error) {
        const cloneError = new Error("Unable to clone the GitHub repository. Ensure it is public and accessible.");
        cloneError.statusCode = 400;
        cloneError.cause = error;
        throw cloneError;
    }
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
