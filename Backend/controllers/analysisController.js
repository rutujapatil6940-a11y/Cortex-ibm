const Repository = require("../Models/repository");
const { parseGitHubRepositoryUrl } = require("../services/githubService");
const { processGitHubRepository } = require("../services/repositoryProcessingService");

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
        const processed = await processGitHubRepository(record, repository);
        return res.status(200).json({
            success: true,
            repository: {
                id: processed._id,
                name: processed.name,
                owner: processed.owner,
                repositoryUrl: processed.repositoryUrl,
                sourceType: processed.sourceType,
                status: processed.status,
                metadata: processed.metadata,
            },
            analysis: processed.analysis,
        });
    } catch (error) {
        return res.status(error.statusCode || 502).json({
            success: false,
            repository: { id: record._id, status: "failed", sourceType: "github" },
            message: error.message || "Repository analysis failed.",
        });
    }
}

module.exports = { analyzeGitHubRepository };
