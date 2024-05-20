/* eslint-disable react/prop-types */
import { socket } from "../utils/createSocketHost";
import { addNewMessage, fetchAllUsers } from "../utils/backendRequest";
import "./styles/Chat.css";
import { useRef } from "react";

const Input = ({
  message,
  setMessage,
  selectedUserId,
  setChat,
  chat,
  myprofile,
  setAllUsers,
}) => {
  const sendTypingRef = useRef(null);

  const sendChat = async (e) => {
    e.preventDefault();

    if (!message) return;

    socket.emit("send-msg", {
      message: message,
      from: myprofile._id,
      to: selectedUserId,
    });

    setChat([
      ...chat,
      {
        message,
        fromSelf: true,
        from: myprofile._id,
        time: new Date().toString(),
      },
    ]);

    addNewMessage({
      message: message,
      from: myprofile._id,
      to: selectedUserId,
      time: new Date().toString(),
    }).then(() => {
      fetchAllUsers().then((data) => {
        setAllUsers(data);
      });
    });

    setMessage("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      sendChat(e);
    }
  };

  const handleInputChange = (e) => {
    setMessage(e.target.value);

    socket.emit("typing...", {
      to: selectedUserId,
      from: myprofile._id,
    });

    if (sendTypingRef.current) {
      clearTimeout(sendTypingRef.current);
    }

    sendTypingRef.current = setTimeout(() => {
      socket.emit("stopTyping", {
        to: selectedUserId,
      });
    }, 1000);
  };

  return (
    <form onSubmit={sendChat} id="messageInput">
      <textarea
        name="chat"
        id="chat"
        placeholder="Type a message"
        value={message}
        onChange={handleInputChange}
        onKeyDown={handleKeyPress}
      />
      <button type="submit">
        <span className="material-symbols-outlined">send</span>
      </button>
    </form>
  );
};

export default Input;
