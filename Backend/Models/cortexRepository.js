const mongoose = require("mongoose");
const { getCortexDB } = require("../services/cortexDb");

const cortexRepositorySchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            index: true,
        },

        name: {
            type: String,
            required: true,
            trim: true,
        },

        owner: {
            type: String,
            required: true,
            trim: true,
        },

        repositoryUrl: {
            type: String,
            required: true,
            trim: true,
        },

        sourceType: {
            type: String,
            enum: ["github"],
            required: true,
            default: "github",
        },

        status: {
            type: String,
            enum: [
                "uploaded",
                "processing",
                "workspace_ready",
                "analyzing",
                "processed",
                "failed",
            ],
            required: true,
            default: "uploaded",
        },

        metadata: {
            defaultBranch: String,
            fileCount: {
                type: Number,
                default: 0,
            },
            sourceFileCount: {
                type: Number,
                default: 0,
            },
            sourceBytes: {
                type: Number,
                default: 0,
            },
            skippedFiles: {
                type: Number,
                default: 0,
            },
        },

        analysis: {
            type: mongoose.Schema.Types.Mixed,
            default: null,
        },

        error: {
            type: String,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

function getCortexRepositoryModel() {
    const db = getCortexDB();

    return (
        db.models.CortexRepository ||
        db.model("CortexRepository", cortexRepositorySchema)
    );
}

module.exports = {
    getCortexRepositoryModel,
};