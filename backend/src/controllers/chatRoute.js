const Message = require("../models/messageModel");

const addNewMessage = async (req, res) => {
  try {
    const newMessage = await Message.create({
      message: req.body.message,
      users: [req.body.from, req.body.to],
      sender: req.body.from,
    });

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
