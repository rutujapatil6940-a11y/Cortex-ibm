const mongoose = require("mongoose");

const repositorySchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
        name: { type: String, required: true, trim: true },
        owner: { type: String, required: true, trim: true },
        repositoryUrl: { type: String, required: true, trim: true },
        sourceType: { type: String, enum: ["github"], required: true, default: "github" },
        status: {
            type: String,
            enum: ["uploaded", "processing", "workspace_ready", "analyzing", "processed", "failed"],
            required: true,
            default: "uploaded",
        },
        metadata: {
            defaultBranch: String,
            fileCount: { type: Number, default: 0 },
            sourceFileCount: { type: Number, default: 0 },
            sourceBytes: { type: Number, default: 0 },
            skippedFiles: { type: Number, default: 0 },
        },
        analysis: { type: mongoose.Schema.Types.Mixed },
        error: { type: String, default: null },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Repository", repositorySchema);
