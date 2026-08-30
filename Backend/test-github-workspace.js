const assert = require("assert/strict");
const fs = require("fs/promises");
const { randomBytes } = require("crypto");
const path = require("path");
const { parseGitHubRepositoryUrl } = require("./services/githubService");
const {
    cleanupRepositoryWorkspace,
    enforceWorkspaceSize,
    getRepositoryWorkspacePath,
    verifyRepositoryWorkspace,
} = require("./services/repositoryWorkspaceService");
const { processGitHubRepository } = require("./services/repositoryProcessingService");

const repositoryUrl = process.argv[2] || "https://github.com/octocat/Hello-World";
const workspaceId = randomBytes(12).toString("hex");

async function run() {
    assert.equal(parseGitHubRepositoryUrl("not-a-github-url"), null);
    const repository = parseGitHubRepositoryUrl(repositoryUrl);
    assert.ok(repository);

    const workspace = getRepositoryWorkspacePath(workspaceId);
    const repositoryRecord = {
        _id: { toString: () => workspaceId },
        error: "previous error",
        metadata: {},
        saveCalls: 0,
        status: "uploaded",
        async save() {
            this.saveCalls += 1;
        },
    };

    try {
        const processed = await processGitHubRepository(repositoryRecord, repository);
        assert.equal(processed.workspaceId, workspaceId);
        assert.equal(processed.repositoryRecord, repositoryRecord);
        assert.equal(repositoryRecord.status, "workspace_ready");
        assert.equal(repositoryRecord.error, null);
        assert.ok(repositoryRecord.metadata.defaultBranch);
        assert.equal(repositoryRecord.saveCalls, 2);

        const entries = await fs.readdir(workspace);
        const readme = entries.find((entry) => /^readme(?:\..+)?$/i.test(entry));

        assert.ok(entries.length > 0, "The cloned workspace should contain repository files.");
        assert.ok(readme, "The public test repository should contain a README file.");
        assert.ok((await verifyRepositoryWorkspace(workspace)).length > 0, "The cloned workspace should contain repository files outside .git.");
        assert.ok((await enforceWorkspaceSize(workspace)) > 0, "The cloned workspace should have a non-zero size.");
        await fs.access(path.join(workspace, readme));
        console.log("GitHub workspace clone test passed.");
    } finally {
        await cleanupRepositoryWorkspace(workspaceId);
        await assert.rejects(fs.access(workspace));
        console.log("GitHub workspace cleanup test passed.");
    }
}

run().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
