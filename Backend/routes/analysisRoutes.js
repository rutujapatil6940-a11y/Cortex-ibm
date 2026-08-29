const express = require("express");
const protect = require("../middleware/authmiddleware");
const { analyzeGitHubRepository } = require("../controllers/analysisController");

const router = express.Router();
router.post("/github", protect, analyzeGitHubRepository);

module.exports = router;
