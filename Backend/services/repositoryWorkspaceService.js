const fs = require("fs/promises");
const os = require("os");
const path = require("path");

const WORKSPACE_ROOT = path.join(os.tmpdir(), "cortex");
const MAX_WORKSPACE_BYTES = Number(process.env.REPOSITORY_MAX_WORKSPACE_BYTES || 200 * 1024 * 1024);

function getRepositoryWorkspacePath(workspaceId) {
    const normalizedWorkspaceId = String(workspaceId || "");
    if (!/^[a-f\d]{24}$/i.test(normalizedWorkspaceId)) {
        throw new Error("A valid repository workspace ID is required.");
    }

    return path.join(WORKSPACE_ROOT, normalizedWorkspaceId);
}

async function getWorkspaceSize(directory) {
    let totalBytes = 0;
    const entries = await fs.readdir(directory, { withFileTypes: true });

    for (const entry of entries) {
        const entryPath = path.join(directory, entry.name);
        if (entry.isDirectory()) {
            totalBytes += await getWorkspaceSize(entryPath);
        } else if (entry.isFile()) {
            totalBytes += (await fs.stat(entryPath)).size;
        }
    }

    return totalBytes;
}

async function enforceWorkspaceSize(workspace) {
    const workspaceBytes = await getWorkspaceSize(workspace);
    if (workspaceBytes > MAX_WORKSPACE_BYTES) {
        const error = new Error("The cloned repository exceeds the allowed workspace size.");
        error.statusCode = 413;
        throw error;
    }

    return workspaceBytes;
}

async function verifyRepositoryWorkspace(workspace) {
    const entries = await fs.readdir(workspace, { withFileTypes: true });
    const repositoryEntries = entries.filter((entry) => entry.name !== ".git");
    if (!repositoryEntries.length) {
        const error = new Error("The GitHub repository is empty.");
        error.statusCode = 422;
        throw error;
    }

    return repositoryEntries.map((entry) => entry.name);
}

async function cleanupRepositoryWorkspace(workspaceId) {
    const workspace = getRepositoryWorkspacePath(workspaceId);
    await fs.rm(workspace, { recursive: true, force: true });
    console.log("Repository workspace cleanup completed", { workspaceId });
}

module.exports = {
    cleanupRepositoryWorkspace,
    enforceWorkspaceSize,
    getRepositoryWorkspacePath,
    getWorkspaceSize,
    verifyRepositoryWorkspace,
};
