const {
    getCortexRepositoryModel,
} = require("../Models/cortexRepository");

const {
    askBobAboutRepository,
} = require("../services/bobChatService");

const bobChat = async (req, res) => {
    try {
        const { projectId, message } = req.body;

        if (!projectId) {
            return res.status(400).json({
                success: false,
                message: "projectId is required",
            });
        }

        if (!message || !String(message).trim()) {
            return res.status(400).json({
                success: false,
                message: "message is required",
            });
        }

        const CortexRepository =
            getCortexRepositoryModel();

        /*
         * Fetch only the authenticated user's project.
         * This prevents one user from chatting with
         * another user's repository.
         */
        const project =
            await CortexRepository.findOne({
                _id: projectId,
                userId: req.user.userId,
            }).lean();

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found",
            });
        }

        if (!project.repositoryContext) {
            return res.status(422).json({
                success: false,
                message:
                    "Repository context is not available for this project.",
            });
        }

        const result =
            await askBobAboutRepository(
                project.repositoryContext,
                message
            );

        return res.status(200).json({
            success: true,
            answer: result.answer,
            project: {
                id: project._id,
                name: project.name,
                repositoryUrl:
                    project.repositoryUrl,
            },
        });
    } catch (error) {
        console.error(
            "Bob Chat controller error:",
            {
                message: error.message,
                code: error.code,
            }
        );

        return res.status(
            error.statusCode || 500
        ).json({
            success: false,
            message:
                error.message ||
                "Failed to process Bob Chat request.",
        });
    }
};

module.exports = {
    bobChat,
};