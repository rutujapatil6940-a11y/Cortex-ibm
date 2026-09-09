const {
    getCortexRepositoryModel,
} = require("../Models/cortexRepository");

const getProjects = async (req, res) => {
    try {
        const CortexRepository = getCortexRepositoryModel();

        const projects = await CortexRepository.find({
            userId: req.user.userId,
        })
            .sort({ createdAt: -1 })
            .select(
                "_id name owner repositoryUrl sourceType status metadata analysis repositoryContext createdAt updatedAt error"
            )
            .lean();

        return res.status(200).json({
            success: true,
            count: projects.length,
            projects,
        });
    } catch (error) {
        console.error("Get CodeAtlas projects error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch projects",
        });
    }
};

const getProjectById = async (req, res) => {
    try {
        const CortexRepository = getCortexRepositoryModel();

        const project = await CortexRepository.findOne({
            _id: req.params.id,
            userId: req.user.userId,
        }).lean();

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found",
            });
        }

        return res.status(200).json({
            success: true,
            project,
        });
    } catch (error) {
        console.error("Get CodeAtlas project error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch project",
        });
    }
};

module.exports = {
    getProjects,
    getProjectById,
};