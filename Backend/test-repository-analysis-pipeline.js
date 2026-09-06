const assert = require("assert/strict");
const fs = require("fs/promises");
const os = require("os");
const path = require("path");

const {
    extractAssistantMessage,
    extractBobResultEvent,
    extractStructuredAnalysis,
} = require("./services/bobService");
const { buildRepositoryContext } = require("./services/repositoryContextService");

const schemaFields = {
    projectOverview: "Cortex test project.",
    technologiesUsed: [],
    projectStructure: [],
    importantFiles: [],
    importantFunctionsAndComponents: [],
    apiAndBackendInformation: [],
    setupInstructions: [],
    howTheProjectWorks: [],
    importantDependencies: [],
    dataFlow: [],
    configurationAndEnvironmentVariables: [],
    potentialImportantNotes: [],
};

function makeResult(lastMessage) {
    return {
        type: "result",
        status: "success",
        ...(lastMessage ? { last_message: lastMessage } : {}),
        stats: { task_id: "test-task" },
    };
}

function expectCode(callback, code) {
    try {
        callback();
        assert.fail(`Expected ${code}`);
    } catch (error) {
        assert.equal(error.code, code);
    }
}

function testBobOutputParsing() {
    const direct = JSON.stringify(makeResult(JSON.stringify(schemaFields)));
    const directExtraction = extractBobResultEvent(direct);
    assert.equal(extractAssistantMessage(directExtraction.resultEvent, directExtraction.events), JSON.stringify(schemaFields));
    assert.deepEqual(extractStructuredAnalysis(JSON.stringify(schemaFields)), schemaFields);

    const markdown = `Preliminary analysis follows.\n\n\`\`\`json\n${JSON.stringify(schemaFields)}\n\`\`\``;
    assert.deepEqual(extractStructuredAnalysis(markdown), schemaFields);

    const ndjson = [
        "Bob progress: preparing context",
        JSON.stringify({ type: "message", role: "assistant", content: markdown }),
        JSON.stringify(makeResult()),
    ].join("\n");
    const streamExtraction = extractBobResultEvent(ndjson);
    assert.equal(streamExtraction.resultEvent.status, "success");
    assert.deepEqual(
        extractStructuredAnalysis(extractAssistantMessage(streamExtraction.resultEvent, streamExtraction.events)),
        schemaFields
    );

    expectCode(() => extractBobResultEvent(JSON.stringify({ type: "message", role: "assistant", content: "done" })), "BOB_MISSING_RESULT_EVENT");
    expectCode(() => extractStructuredAnalysis(JSON.stringify({ projectOverview: "partial" })), "BOB_INVALID_ANALYSIS_SCHEMA");
}

async function testRepositoryContext() {
    const originalEnvironment = {};
    const environment = {
        REPOSITORY_MAX_FILE_BYTES: "200",
        REPOSITORY_MAX_FILE_CHARS: "50",
        REPOSITORY_MAX_CONTEXT_BYTES: "500",
        REPOSITORY_MAX_CONTEXT_FILES: "3",
        REPOSITORY_MAX_INVENTORY_ENTRIES: "100",
        REPOSITORY_MAX_SKIPPED_ENTRIES: "100",
        REPOSITORY_MAX_SCANNED_FILES: "100",
    };
    for (const [name, value] of Object.entries(environment)) {
        originalEnvironment[name] = process.env[name];
        process.env[name] = value;
    }

    const workspace = await fs.mkdtemp(path.join(os.tmpdir(), "cortex-context-test-"));
    try {
        await fs.mkdir(path.join(workspace, "assets"), { recursive: true });
        await fs.mkdir(path.join(workspace, "node_modules", "example"), { recursive: true });
        await fs.mkdir(path.join(workspace, "src"), { recursive: true });
        await fs.writeFile(path.join(workspace, "package.json"), "{\"name\":\"fixture\"}");
        await fs.writeFile(path.join(workspace, "README.md"), "R".repeat(120));
        await fs.writeFile(path.join(workspace, "src", "index.js"), "const apiKey = \"do-not-send-123\";\nexport const entry = true;");
        await fs.writeFile(path.join(workspace, "src", "extra.js"), "export const extra = true;");
        await fs.writeFile(path.join(workspace, "assets", "logo.png"), Buffer.from([137, 80, 78, 71]));
        await fs.writeFile(path.join(workspace, "large.json"), "x".repeat(201));
        await fs.writeFile(path.join(workspace, ".env"), "SECRET=never-send");
        await fs.writeFile(path.join(workspace, "node_modules", "example", "index.js"), "module.exports = true;");

        const context = await buildRepositoryContext(workspace, {
            owner: "cortex",
            repository: "fixture",
            repositoryUrl: "https://github.com/cortex/fixture",
        });

        assert.deepEqual(context.sourceFiles.map((file) => file.path), ["package.json", "README.md", "src/index.js"]);
        assert.ok(context.sourceFiles[1].contentTruncated);
        assert.equal(context.sourceFiles[2].sensitiveValuesRedacted, true);
        assert.equal(context.sourceFiles[2].content.includes("do-not-send-123"), false);
        assert.ok(context.scan.sourceBytes <= 500);
        assert.equal(context.structure.files.find((file) => file.path === "assets/logo.png")?.type, "media");
        assert.equal(context.sourceFiles.some((file) => file.path === "assets/logo.png"), false);
        assert.ok(context.scan.skipped.some((file) => file.path === "assets/logo.png" && file.reason === "binary_media"));
        assert.ok(context.scan.skipped.some((file) => file.path === "large.json" && file.reason === "file_too_large"));
        assert.equal(context.scan.skipped.some((file) => file.path === ".env"), false);
        assert.ok(context.scan.skippedByReason.ignored_directory >= 1);
        assert.ok(context.scan.skippedByReason.context_file_limit >= 1);

        const mediaOnly = await fs.mkdtemp(path.join(os.tmpdir(), "cortex-media-only-test-"));
        try {
            await fs.writeFile(path.join(mediaOnly, "photo.jpg"), Buffer.from([255, 216, 255]));
            await assert.rejects(
                buildRepositoryContext(mediaOnly, { owner: "cortex", repository: "media", repositoryUrl: "https://github.com/cortex/media" }),
                (error) => error.code === "REPOSITORY_INSUFFICIENT_ANALYZABLE_FILES"
            );
        } finally {
            await fs.rm(mediaOnly, { recursive: true, force: true });
        }

        process.env.REPOSITORY_MAX_CONTEXT_BYTES = "1";
        const budgetOnly = await fs.mkdtemp(path.join(os.tmpdir(), "cortex-budget-only-test-"));
        try {
            await fs.writeFile(path.join(budgetOnly, "package.json"), "{\"name\":\"budget\"}");
            await assert.rejects(
                buildRepositoryContext(budgetOnly, { owner: "cortex", repository: "budget", repositoryUrl: "https://github.com/cortex/budget" }),
                (error) => error.code === "REPOSITORY_CONTEXT_BUDGET_EXHAUSTED"
            );
        } finally {
            await fs.rm(budgetOnly, { recursive: true, force: true });
        }
    } finally {
        await fs.rm(workspace, { recursive: true, force: true });
        for (const [name, value] of Object.entries(originalEnvironment)) {
            if (value === undefined) delete process.env[name];
            else process.env[name] = value;
        }
    }
}

async function main() {
    testBobOutputParsing();
    await testRepositoryContext();
    console.log("Repository analysis pipeline tests passed.");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
