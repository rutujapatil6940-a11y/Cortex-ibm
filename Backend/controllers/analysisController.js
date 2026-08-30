const Repository = require("../Models/repository");
const { parseGitHubRepositoryUrl } = require("../services/githubService");
const { generateDocumentation, runBobHealthCheck } = require("../services/bobService");
const {
    cleanupRepositoryWorkspace,
    getRepositoryWorkspacePath,
    processGitHubRepository,
} = require("../services/repositoryProcessingService");
const { buildRepositoryContext } = require("../services/repositoryContextService");
const { verifyRepositoryWorkspace } = require("../services/repositoryWorkspaceService");

function serializeRepository(record) {
    return {
        id: record._id,
        name: record.name,
        owner: record.owner,
        repositoryUrl: record.repositoryUrl,
        sourceType: record.sourceType,
        status: record.status,
        metadata: record.metadata,
    };
}

function serializeAnalysis(record) {
    const analysis = record.analysis?.toObject ? record.analysis.toObject() : record.analysis || {};
    return {
        ...analysis,
        id: record._id,
        status: record.status,
        repository: serializeRepository(record),
    };
}

function safeAnalysisError(error) {
    if (error?.statusCode) return error;

    const safeError = new Error("The repository workspace is unavailable for analysis.");
    safeError.statusCode = 500;
    return safeError;
}

async function analyzeGitHubRepository(req, res) {
    const repository = parseGitHubRepositoryUrl(req.body?.repositoryUrl);
    if (!repository) {
        return res.status(400).json({ success: false, message: "Provide a valid HTTPS GitHub repository URL in the form https://github.com/owner/repository." });
    }

    const record = await Repository.create({
        user: req.user.userId,
        name: repository.repository,
        owner: repository.owner,
        repositoryUrl: repository.repositoryUrl,
        sourceType: "github",
        status: "uploaded",
    });

    try {
        const { repositoryRecord: processed } = await processGitHubRepository(record, repository);
        return res.status(200).json({
            success: true,
            message: "Repository cloned and ready for analysis.",
            analysisId: processed._id,
            status: "workspace_ready",
            repository: serializeRepository(processed),
            analysis: { id: processed._id, status: "workspace_ready" },
        });
    } catch (error) {
        return res.status(error.statusCode || 502).json({
            success: false,
            repository: { id: record._id, status: "failed", sourceType: "github" },
            message: error.message || "Repository analysis failed.",
        });
    }
}

async function analyzeRepositoryWorkspace(req, res) {
    const analysisId = String(req.params.analysisId || "");
    if (!/^[a-f\d]{24}$/i.test(analysisId)) {
        return res.status(400).json({ success: false, message: "A valid analysis ID is required." });
    }

    const record = await Repository.findOne({ _id: analysisId, user: req.user.userId });
    if (!record) {
        return res.status(404).json({ success: false, message: "Repository analysis not found." });
    }

    if (record.status === "processed" && record.analysis) {
        return res.status(200).json({
            success: true,
            message: "Repository analysis is already complete.",
            analysisId: record._id,
            status: record.status,
            repository: serializeRepository(record),
            analysis: serializeAnalysis(record),
        });
    }

    if (record.status === "analyzing") {
        return res.status(409).json({ success: false, message: "Repository analysis is already in progress." });
    }

    if (record.status !== "workspace_ready") {
        return res.status(409).json({ success: false, message: "Repository workspace is not ready for analysis." });
    }

    const workspace = getRepositoryWorkspacePath(analysisId);
    try {
        record.status = "analyzing";
        record.error = null;
        await record.save();

        await verifyRepositoryWorkspace(workspace);
        const bobHealth = await runBobHealthCheck();
        console.log("IBM Bob preflight completed", {
            workspaceId: analysisId,
            bobVersion: bobHealth.bobVersion,
            inferenceElapsedMs: bobHealth.inferenceElapsedMs,
        });
        const repository = {
            owner: record.owner,
            repository: record.name,
            repositoryUrl: record.repositoryUrl,
            branch: record.metadata?.defaultBranch,
        };
        const repositoryContext = await buildRepositoryContext(workspace, repository);
        const { analysis } = await generateDocumentation(workspace, repositoryContext, analysisId);

        record.analysis = analysis;
        record.status = "processed";
        record.metadata.fileCount = repositoryContext.scan.fileCount;
        record.metadata.sourceFileCount = repositoryContext.scan.sourceFileCount;
        record.metadata.sourceBytes = repositoryContext.scan.sourceBytes;
        record.metadata.skippedFiles = repositoryContext.scan.skippedFiles;
        await record.save();

        return res.status(200).json({
            success: true,
            message: "Repository analysis completed.",
            analysisId: record._id,
            status: record.status,
            repository: serializeRepository(record),
            analysis: serializeAnalysis(record),
        });
    } catch (error) {
        const analysisError = safeAnalysisError(error);
        record.status = "failed";
        record.error = analysisError.message;
        await record.save();
        console.error("Repository analysis failed", {
            workspaceId: analysisId,
            message: analysisError.message,
        });
        return res.status(analysisError.statusCode).json({
            success: false,
            analysisId: record._id,
            status: record.status,
            message: analysisError.message,
        });
    } finally {
        try {
            await cleanupRepositoryWorkspace(analysisId);
        } catch (cleanupError) {
            console.error("Repository workspace cleanup failed", {
                workspaceId: analysisId,
                message: cleanupError.message,
            });
        }
    }
}

module.exports = { analyzeGitHubRepository, analyzeRepositoryWorkspace };
