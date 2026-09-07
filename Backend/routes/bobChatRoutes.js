const express = require("express");
const protect = require("../middleware/authmiddleware");

const {
    bobChat,
} = require("../controllers/bobChatController");

const router = express.Router();

router.post("/", protect, bobChat);

module.exports = router;