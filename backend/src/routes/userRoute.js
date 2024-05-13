const express = require("express");
const router = express.Router();
const {
  userSignup,
  userSignin,
  userProfile,
  allUsers,
  userById,
} = require("../controllers/userRoute");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/signup", userSignup);
router.post("/signin", userSignin);
router.get("/profile", authMiddleware, userProfile);
router.get("/all", authMiddleware, allUsers);
router.get("/:userId", authMiddleware, userById);

module.exports = router;
