/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { socket } from "../utils/createSocketHost";
import {
  fetchAllUsers,
  fetchUserProfile,
  getMessages,
  incrementUnreadMsg,
} from "../utils/backendRequest";
import Input from "./Input";
import RequestPopUp from "./RequestPopUp";
import VideoCall from "./VideoCall";
import "./styles/Chat.css";

const ShowChat = ({
  myprofile,
  setMyProfile,
  selectedUserId,
  message,
  setMessage,
  setAllUsers,
  setIsTyping,
  peerId,
  currentUserVideoRef,
  remoteVideoRef,
  peerInstance,
  openVideoCall,
  setOpenVideoCall,
  requestId,
  setRequestId,
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

      if (from !== selectedUserId) {
        incrementUnreadMsg(from).then(() => {
          fetchUserProfile().then((data) => {
            setMyProfile(data);
          });
        });
      }
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
    }, 150);
  }, [chat]);

  useEffect(() => {
    getMessages({ from: myprofile._id, to: selectedUserId }).then((data) => {
      setChat(data);
    });
    setIsTyping(false);
  }, [myprofile._id, selectedUserId]);

  useEffect(() => {
    socket.on("requestVideoCall", (from) => {
      setRequestId(from);
    });
  }, []);

  useEffect(() => {
    chatRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  let lastDisplayedDate = null;

  return (
    <>
      <section id="showChat">
        {chat.map((mess, index) => {
          const currentDate = mess.time.substring(4, 15);
          const showDate = lastDisplayedDate !== currentDate;
          if (showDate) {
            lastDisplayedDate = currentDate;
          }

          return (
            <>
              {(mess.fromSelf || mess.from === selectedUserId) && showDate && (
                <div className="DateAndYear">
                  <p>{currentDate}</p>
                </div>
              )}
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
            </>
          );
        })}
        {requestId === selectedUserId && (
          <RequestPopUp
            setRequestId={setRequestId}
            to={selectedUserId}
            from={myprofile._id}
            peerId={peerId}
            setOpenVideoCall={setOpenVideoCall}
          />
        )}
        {openVideoCall && (
          <VideoCall
            to={selectedUserId}
            from={myprofile._id}
            peerInstance={peerInstance}
            currentUserVideoRef={currentUserVideoRef}
            remoteVideoRef={remoteVideoRef}
            setOpenVideoCall={setOpenVideoCall}
          />
        )}
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
