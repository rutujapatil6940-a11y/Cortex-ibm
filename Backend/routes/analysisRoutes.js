const express = require("express");
const protect = require("../middleware/authmiddleware");
const {
    analyzeGitHubRepository,
    analyzeRepositoryWorkspace,
} = require("../controllers/analysisController");

const router = express.Router();
router.post("/github", protect, analyzeGitHubRepository);
router.post("/:analysisId/analyze", protect, analyzeRepositoryWorkspace);

module.exports = router;
