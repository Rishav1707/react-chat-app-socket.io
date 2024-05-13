const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();
const { addNewMessage, getMessages } = require("../controllers/chatRoute");

router.post("/addMessages", authMiddleware, addNewMessage);
router.post("/getMessages", authMiddleware, getMessages);

module.exports = router;
