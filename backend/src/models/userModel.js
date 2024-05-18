const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    profileImg: {
      type: String,
      default: "https://satvision.in/wp-content/uploads/2019/06/user.jpg",
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      minLength: 3,
      maxLength: 30,
    },
    password: {
      type: String,
      required: true,
      minLength: 6,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
      maxLength: 50,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      maxLength: 50,
    },
    unreadMsgCount: {
      type: Number,
      default: 0,
    },
    lastMessage: [
      {
        to: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        message: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Message",
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
module.exports = User;
