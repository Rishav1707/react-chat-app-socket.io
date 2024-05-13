/* eslint-disable react/prop-types */
import { useEffect, useRef } from "react";
import { socket } from "../utils/createSocketHost";
import { getMessages } from "../utils/backendRequest";
import "./styles/Chat.css";

const ShowChat = ({ chat, setChat, myprofile, selectedUserId }) => {
  const chatRef = useRef(null);

  useEffect(() => {
    socket.on("msg-recieved", (message) => {
      setChat([...chat, { message, fromSelf: false }]);
    });

    chatRef.current.scrollIntoView({ behavior: "smooth" });
  }, [chat, setChat]);

  useEffect(() => {
    getMessages({ from: myprofile._id, to: selectedUserId }).then((data) => {
      setChat(data);
    });
  }, [myprofile._id, selectedUserId, setChat]);

  return (
    <section id="showChat">
      {chat.map((mess, index) => (
        <div
          className={mess.fromSelf ? "currentUser" : "otherUser"}
          key={index}
        >
          <p>{mess.message}</p>
        </div>
      ))}
      <div ref={chatRef}></div>
    </section>
  );
};

export default ShowChat;
