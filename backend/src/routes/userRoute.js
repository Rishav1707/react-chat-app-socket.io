const express = require("express");
const router = express.Router();
const {
  userSignup,
  userSignin,
  userProfile,
  allUsers,
  userById,
  incrementUnreadMessages,
  resetUnreadMessages,
  filterUsers,
} = require("../controllers/userRoute");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/signup", userSignup);
router.post("/signin", userSignin);
router.get("/profile", authMiddleware, userProfile);
router.get("/all", authMiddleware, allUsers);
router.put(
  "/unreadMessages/increment",
  authMiddleware,
  incrementUnreadMessages
);
router.put("/unreadMessages/reset", authMiddleware, resetUnreadMessages);
router.get("/filter", authMiddleware, filterUsers);
router.get("/:userId", authMiddleware, userById);

module.exports = router;
