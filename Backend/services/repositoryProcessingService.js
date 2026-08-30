const { cloneGitHubRepository, getDefaultBranch } = require("./githubService");
const {
    cleanupRepositoryWorkspace,
    enforceWorkspaceSize,
    getRepositoryWorkspacePath,
    verifyRepositoryWorkspace,
} = require("./repositoryWorkspaceService");

async function processGitHubRepository(repositoryRecord, repository) {
    const workspaceId = repositoryRecord._id.toString();
    const workspace = getRepositoryWorkspacePath(workspaceId);
    repositoryRecord.status = "processing";
    repositoryRecord.error = null;
    await repositoryRecord.save();

    try {
        await cloneGitHubRepository(repository.repositoryUrl, workspace, workspaceId);
        await enforceWorkspaceSize(workspace);
        await verifyRepositoryWorkspace(workspace);
        const defaultBranch = await getDefaultBranch(workspace);
        repositoryRecord.metadata.defaultBranch = defaultBranch || undefined;
        repositoryRecord.status = "workspace_ready";
        await repositoryRecord.save();
        console.log("Repository workspace ready", { workspaceId });
        return { repositoryRecord, workspaceId };
    } catch (error) {
        repositoryRecord.status = "failed";
        repositoryRecord.error = error.message || "Repository processing failed.";
        await repositoryRecord.save();
        try {
            await cleanupRepositoryWorkspace(workspaceId);
        } catch (cleanupError) {
            console.error("Repository workspace cleanup failed", {
                workspaceId,
                message: cleanupError.message,
            });
        }
        throw error;
    }
}

module.exports = { processGitHubRepository, cleanupRepositoryWorkspace, getRepositoryWorkspacePath };
