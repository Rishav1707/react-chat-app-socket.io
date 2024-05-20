const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const getJwtToken = require("../utils/generateToken");

const userSignup = async (req, res) => {
  try {
    const userAlreadyExists = await User.findOne({
      username: req.body.username,
    });
    if (userAlreadyExists) {
      res
        .status(400)
        .json({ message: "User already exists, try different username" });
    } else {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const newUser = await User.create({
        username: req.body.username,
        password: hashedPassword,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
      });
      const token = getJwtToken(newUser._id);
      res
        .status(201)
        .json({ message: "User Created Successfully", token: token });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error while signing up.", error: error.message });
  }
};

const userSignin = async (req, res) => {
  try {
    const userExists = await User.findOne({ username: req.body.username });

    if (!userExists) {
      return res
        .status(403)
        .json({ message: "User doesn't exist, Register yourself first." });
    }

    const validPassword = await bcrypt.compare(
      req.body.password,
      userExists.password
    );

    if (!validPassword) {
      return res.status(401).json({ message: "Invalid username or password." });
    }

    const token = getJwtToken(userExists._id);

    res.status(200).json({
      token: token,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error while signing in.", error: error.message });
  }
};

const userProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId, { password: 0 });
    if (!user) {
      res.status(401).json({ message: "User not found, Invalid User" });
      return;
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({
      message: "Error while fetching user profile.",
      error: err.message,
    });
  }
};

const allUsers = async (req, res) => {
  try {
    const users = await User.find(
      { _id: { $ne: req.userId } },
      { password: 0 }
    ).populate({
      path: "lastMessage.message",
    });

    if (users.length === 0) {
      res.status(404).json({ message: "No users found" });
      return;
    }
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      message: "Error while fetching all users",
      error: error.message,
    });
  }
};

const userById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId, { password: 0 });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      message: "Error while fetching user by id",
      error: error.message,
    });
  }
};

const incrementUnreadMessages = async (req, res) => {
  try {
    await User.updateOne(
      { _id: req.userId, "unreadMsgCount.from": req.body.from },
      {
        $inc: { "unreadMsgCount.$.count": 1 },
      }
    );

    await User.updateOne(
      { _id: req.userId, "unreadMsgCount.from": { $ne: req.body.from } },
      {
        $addToSet: {
          unreadMsgCount: { from: req.body.from, count: 1 },
        },
      }
    );

    res.status(200).json({
      message: "Unread messages incremented successfully.",
    });
  } catch (err) {
    res.status(500).json({
      message: "Error while incrementing unread messages.",
      error: err.message,
    });
  }
};

const resetUnreadMessages = async (req, res) => {
  try {
    await User.updateOne(
      { _id: req.userId, "unreadMsgCount.from": req.body.from },
      {
        $set: { "unreadMsgCount.$.count": 0 },
      }
    );

    res.status(200).json({ message: "Unread messages reset successfully." });
  } catch (error) {
    res.status(500).json({
      message: "Error while resetting unread messages.",
      error: error.message,
    });
  }
};

module.exports = {
  userSignup,
  userSignin,
  userProfile,
  allUsers,
  userById,
  incrementUnreadMessages,
  resetUnreadMessages,
};
