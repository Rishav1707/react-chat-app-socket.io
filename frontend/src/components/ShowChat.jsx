/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { socket } from "../utils/createSocketHost";
import { fetchAllUsers, getMessages } from "../utils/backendRequest";
import Input from "./Input";
import "./styles/Chat.css";

const ShowChat = ({
  myprofile,
  selectedUserId,
  message,
  setMessage,
  setAllUsers,
  setIsTyping,
}) => {
  const [chat, setChat] = useState([]);
  const chatRef = useRef(null);

  useEffect(() => {
    socket.on("msg-recieved", ({ message, from }) => {
      setChat([
        ...chat,
        { message, fromSelf: false, from, time: new Date().toString() },
      ]);

      setIsTyping(false);
    });

    return () => {
      socket.off("msg-recieved");
    };
  }, [chat]);

  useEffect(() => {
    setTimeout(() => {
      fetchAllUsers().then((data) => {
        setAllUsers(data);
      });
    }, 100);
  }, [chat]);

  useEffect(() => {
    getMessages({ from: myprofile._id, to: selectedUserId }).then((data) => {
      setChat(data);
    });
    setIsTyping(false);
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
              <>
                <div className="messContainer">
                  <p className="mess">{mess.message}</p>
                  <div>
                    <sub>{mess.time.split(" ")[4].substring(0, 5)}</sub>
                  </div>
                </div>
              </>
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
        setAllUsers={setAllUsers}
      />
    </>
  );
};

export default ShowChat;
