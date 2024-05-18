const express = require("express");
const router = express.Router();
const {
  userSignup,
  userSignin,
  userProfile,
  allUsers,
  userById,
  incrementUnreadMessages,
} = require("../controllers/userRoute");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/signup", userSignup);
router.post("/signin", userSignin);
router.get("/profile", authMiddleware, userProfile);
router.get("/all", authMiddleware, allUsers);
router.get("/:userId", authMiddleware, userById);
router.put(
  "/unreadMessages/increment",
  authMiddleware,
  incrementUnreadMessages
);

module.exports = router;
