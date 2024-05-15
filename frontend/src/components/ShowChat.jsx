/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { socket } from "../utils/createSocketHost";
import { getMessages } from "../utils/backendRequest";
import Input from "./Input";
import "./styles/Chat.css";

const ShowChat = ({ myprofile, selectedUserId, message, setMessage }) => {
  const [chat, setChat] = useState([]);
  const chatRef = useRef(null);

  useEffect(() => {
    socket.on("msg-recieved", ({ message, from }) => {
      setChat([...chat, { message, fromSelf: false, from }]);
    });

    return () => {
      socket.off("msg-recieved");
    };
  }, [chat]);

  useEffect(() => {
    getMessages({ from: myprofile._id, to: selectedUserId }).then((data) => {
      setChat(data);
    });
  }, [myprofile._id, selectedUserId]);

  useEffect(() => {
    chatRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  return (
    <>
      <section id="showChat">
        {chat.map((mess, index) => (
          <div
            className={mess.fromSelf ? "currentUser" : "otherUser"}
            key={index}
          >
            {(mess.fromSelf || mess.from === selectedUserId) && (
              <p>{mess.message}</p>
            )}
          </div>
        ))}
        <div ref={chatRef}></div>
      </section>
      <Input
        message={message}
        setMessage={setMessage}
        selectedUserId={selectedUserId}
        setChat={setChat}
        chat={chat}
        myprofile={myprofile}
      />
    </>
  );
};

export default ShowChat;
