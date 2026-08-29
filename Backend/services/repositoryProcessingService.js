const fs = require("fs/promises");
const os = require("os");
const path = require("path");
const { randomUUID } = require("crypto");
const { cloneGitHubRepository, getDefaultBranch } = require("./githubService");
const { buildRepositoryContext } = require("./repositoryContextService");
const { analyzeRepository } = require("./bobService");

function createWorkspace() {
    return path.join(os.tmpdir(), `cortex-analysis-${randomUUID()}`);
}

async function processGitHubRepository(repositoryRecord, repository) {
    const workspace = createWorkspace();
    repositoryRecord.status = "processing";
    repositoryRecord.error = null;
    await repositoryRecord.save();

    try {
        // Fetches the actual repository from GitHub.
        await cloneGitHubRepository(repository.repositoryUrl, workspace);
        const defaultBranch = await getDefaultBranch(workspace);
        // Walks the clone and reads actual relevant source-file contents.
        const context = await buildRepositoryContext(workspace, { ...repository, branch: defaultBranch });
        // Sends the real structured context through the existing Bob layer.
        const analysis = await analyzeRepository(workspace, context);
        repositoryRecord.status = "processed";
        repositoryRecord.analysis = analysis;
        repositoryRecord.metadata = {
            defaultBranch,
            fileCount: context.scan.fileCount,
            sourceFileCount: context.scan.sourceFileCount,
            sourceBytes: context.scan.sourceBytes,
            skippedFiles: context.scan.skippedFiles,
        };
        await repositoryRecord.save();
        return repositoryRecord;
    } catch (error) {
        repositoryRecord.status = "failed";
        repositoryRecord.error = error.message || "Repository processing failed.";
        await repositoryRecord.save();
        throw error;
    } finally {
        await fs.rm(workspace, { recursive: true, force: true });
    }
}

module.exports = { processGitHubRepository };
