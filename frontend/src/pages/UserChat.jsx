/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import Header from "../components/Header";
import {
  fetchUserProfile,
  fetchAllUsers,
  userById,
  resetUnreadMsg,
} from "../utils/backendRequest";
import User from "../components/User";
import SideBar from "../components/SideBar";
import StartSkeleton from "../components/StartSkeleton";
import { socket } from "../utils/createSocketHost";
import ShowChat from "../components/ShowChat";
import Peer from "peerjs";
import "./styles/Join.css";

const UserChat = ({ setIsLoggedIn }) => {
  const [myprofile, setMyProfile] = useState({});
  const [allUsers, setAllUsers] = useState([]);
  const [isUserProfileClicked, setIsUserProfileClicked] = useState(false);
  const [userProfile, setUserProfile] = useState({});
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [peerId, setPeerId] = useState(null);
  const remoteVideoRef = useRef(null);
  const currentUserVideoRef = useRef(null);
  const peerInstance = useRef(null);
  const [openVideoCall, setOpenVideoCall] = useState(false);

  useEffect(() => {
    const peer = new Peer("", { debug: 2 });

    peer.on("open", (id) => {
      setPeerId(id);
    });

    peerInstance.current = peer;
  }, []);

  useEffect(() => {
    fetchUserProfile().then((data) => {
      setMyProfile(data);
    });
    fetchAllUsers().then((data) => {
      setAllUsers(data);
    });
  }, []);

  useEffect(() => {
    socket.emit("add-user", myprofile._id);
  }, [myprofile._id]);

  const handleUserProfile = (id) => {
    setSelectedUserId(id);
    userById(id).then((data) => {
      setIsUserProfileClicked(true);
      setUserProfile(data);
    });
    setMessage("");

    const unreadCount = myprofile.unreadMsgCount?.find(
      (unread) => unread.from === id
    )?.count;

    if (unreadCount && unreadCount > 0) {
      resetUnreadMsg(id).then(() => {
        fetchUserProfile().then((data) => {
          setMyProfile(data);
        });
      });
    }
  };

  return (
    <main id="private_room">
      <section id="sideBar">
        <SideBar profile={myprofile} setIsLoggedIn={setIsLoggedIn} />
      </section>
      <section id="groupListSection">
        <p className="grp">Chats</p>
        <div>
          {allUsers.map((user) => (
            <User
              key={user._id}
              user={user}
              isSelected={selectedUserId === user._id}
              onClick={() => handleUserProfile(user._id)}
              myprofile={myprofile}
              setAllUsers={setAllUsers}
            />
          ))}
        </div>
      </section>
      {isUserProfileClicked ? (
        <section id="chatSection">
          <div className="chatInput">
            <Header
              profile={userProfile}
              myprofile={myprofile}
              isTyping={isTyping}
              setIsTyping={setIsTyping}
              peerInstance={peerInstance}
              remoteVideoRef={remoteVideoRef}
              currentUserVideoRef={currentUserVideoRef}
              setOpenVideoCall={setOpenVideoCall}
            />
            <ShowChat
              myprofile={myprofile}
              setMyProfile={setMyProfile}
              selectedUserId={selectedUserId}
              message={message}
              setMessage={setMessage}
              setAllUsers={setAllUsers}
              setIsTyping={setIsTyping}
              peerId={peerId}
              remoteVideoRef={remoteVideoRef}
              currentUserVideoRef={currentUserVideoRef}
              peerInstance={peerInstance}
              openVideoCall={openVideoCall}
              setOpenVideoCall={setOpenVideoCall}
            />
          </div>
        </section>
      ) : (
        <section id="chatSection">
          <StartSkeleton />
        </section>
      )}
    </main>
  );
};

export default UserChat;
