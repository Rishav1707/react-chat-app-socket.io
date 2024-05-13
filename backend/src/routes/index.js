const express = require("express");
const router = express.Router();
const userRoute = require("./userRoute");
const chatRoute = require("./chatRoutes");

router.use("/user", userRoute);
router.use("/chat", chatRoute);

module.exports = router;
