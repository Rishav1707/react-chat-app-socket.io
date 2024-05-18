const Message = require("../models/messageModel");
const User = require("../models/userModel");

const addNewMessage = async (req, res) => {
  try {
    const newMessage = await Message.create({
      message: req.body.message,
      users: [req.body.from, req.body.to],
      sender: req.body.from,
      time: req.body.time,
    });

    // ---------Update the user last Messages with the new messages--------- //

    await User.updateOne(
      { _id: req.body.from, "lastMessage.to": req.body.to },
      {
        $set: { "lastMessage.$.message": newMessage._id },
      }
    );

    await User.updateOne(
      { _id: req.body.from, "lastMessage.to": { $ne: req.body.to } },
      {
        $addToSet: {
          lastMessage: { to: req.body.to, message: newMessage._id },
        },
      }
    );

    // Update or add last message for toUser
    await User.updateOne(
      { _id: req.body.to, "lastMessage.to": req.body.from },
      {
        $set: { "lastMessage.$.message": newMessage._id },
      }
    );

    await User.updateOne(
      { _id: req.body.to, "lastMessage.to": { $ne: req.body.from } },
      {
        $addToSet: {
          lastMessage: { to: req.body.from, message: newMessage._id },
        },
      }
    );

    // --------------------------------------------------------------------- //

    if (newMessage) {
      return res.json({ message: "Message added successfully." });
    } else {
      return res.json({ message: "Failed to add message to the database" });
    }
  } catch (err) {
    res.status(500).json({
      message: "Error while adding messages",
      error: err.message,
    });
  }
};

const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      users: {
        $all: [req.body.from, req.body.to],
      },
    }).sort({ updatedAt: 1 });

    const projectedMessages = messages.map((msg) => {
      return {
        fromSelf: msg.sender.toString() === req.body.from,
        message: msg.message,
        from: msg.sender,
        time: msg.time,
      };
    });
    res.status(200).json(projectedMessages);
  } catch (err) {
    res.status(500).json({
      message: "Error while getting messages",
      error: err.message,
    });
  }
};

module.exports = { addNewMessage, getMessages };
