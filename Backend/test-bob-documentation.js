require("dotenv").config();

const fs = require("fs/promises");
const { randomBytes } = require("crypto");
const { parseGitHubRepositoryUrl, cloneGitHubRepository } = require("./services/githubService");
const { buildRepositoryContext } = require("./services/repositoryContextService");
const { generateDocumentation, runBobHealthCheck } = require("./services/bobService");
const {
    cleanupRepositoryWorkspace,
    getRepositoryWorkspacePath,
    verifyRepositoryWorkspace,
} = require("./services/repositoryWorkspaceService");

async function main() {
    const health = await runBobHealthCheck();
    console.log("IBM Bob health check test passed.", {
        bobVersion: health.bobVersion,
        inferenceElapsedMs: health.inferenceElapsedMs,
    });

    const repository = parseGitHubRepositoryUrl(process.argv[2] || "https://github.com/octocat/Hello-World");
    if (!repository) {
        throw new Error("Provide a valid HTTPS GitHub repository URL.");
    }

    const workspaceId = randomBytes(12).toString("hex");
    const workspace = getRepositoryWorkspacePath(workspaceId);

    try {
        await cloneGitHubRepository(repository.repositoryUrl, workspace, workspaceId);
        await verifyRepositoryWorkspace(workspace);
        const context = await buildRepositoryContext(workspace, repository);
        const { analysis, bobResult } = await generateDocumentation(workspace, context, workspaceId);

        if (!analysis.projectOverview || !bobResult.stats?.task_id) {
            throw new Error("IBM Bob returned an incomplete analysis result.");
        }

        console.log("IBM Bob repository analysis test passed.");
    } finally {
        await cleanupRepositoryWorkspace(workspaceId);
        await fs.access(workspace).then(
            () => { throw new Error("Repository workspace was not cleaned up."); },
            () => undefined
        );
        console.log("IBM Bob repository workspace cleanup test passed.");
    }
}

main().catch((error) => {
    console.error(`IBM Bob test failed: ${error.message}`);
    process.exitCode = 1;
});
