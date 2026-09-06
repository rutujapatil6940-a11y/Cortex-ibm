const express = require("express");
const protect = require("../middleware/authmiddleware");

const {
    getProjects,
    getProjectById,
} = require("../controllers/projectsController");

const router = express.Router();

router.get("/", protect, getProjects);
router.get("/:id", protect, getProjectById);

module.exports = router;