/* eslint-disable react/prop-types */
import { socket } from "../utils/createSocketHost";
import { addNewMessage } from "../utils/backendRequest";
import "./styles/Chat.css";

const Input = ({
  message,
  setMessage,
  selectedUserId,
  setChat,
  chat,
  myprofile,
}) => {
  const sendChat = async (e) => {
    e.preventDefault();
    if (!message) return;
    socket.emit("send-msg", {
      message: message,
      to: selectedUserId,
    });
    setChat([...chat, { message, fromSelf: true }]);
    setMessage("");
    await addNewMessage({
      message: message,
      from: myprofile._id,
      to: selectedUserId,
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      sendChat(e);
    }
  };

  return (
    <form onSubmit={sendChat} id="messageInput">
      <textarea
        name="chat"
        id="chat"
        placeholder="Type a message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyPress}
      />
      <button type="submit">
        <span className="material-symbols-outlined">send</span>
      </button>
    </form>
  );
};

export default Input;
