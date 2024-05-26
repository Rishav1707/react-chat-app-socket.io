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
import SearchInput from "../components/SearchInput";
import LoadingSpinner from "../components/LoadingSpinner";

const UserChat = ({ setIsLoggedIn }) => {
  const [myprofile, setMyProfile] = useState({});
  const [allUsers, setAllUsers] = useState([]);
  const [isUserProfileClicked, setIsUserProfileClicked] = useState(false);
  const [isUserClickedMobile, setIsUserClickedMobile] = useState(false);
  const [userProfile, setUserProfile] = useState({});
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [peerId, setPeerId] = useState(null);
  const remoteVideoRef = useRef(null);
  const currentUserVideoRef = useRef(null);
  const peerInstance = useRef(null);
  const [openVideoCall, setOpenVideoCall] = useState(false);
  const [requestId, setRequestId] = useState(null);
  const [nametobeFiltered, setNameToBeFiltered] = useState("");
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    const peer = new Peer("", { debug: 2 });

    peer.on("open", (id) => {
      setPeerId(id);
    });

    peerInstance.current = peer;
  }, []);

  useEffect(() => {
    setLoader(true);
    fetchUserProfile().then((data) => {
      setMyProfile(data);
    });
    fetchAllUsers().then((data) => {
      setAllUsers(data);
      setLoader(false);
    });
  }, []);

  useEffect(() => {
    socket.emit("add-user", myprofile._id);
  }, [myprofile._id]);

  const handleUserProfile = (id) => {
    setSelectedUserId(id);
    userById(id).then((data) => {
      setIsUserProfileClicked(true);
      setIsUserClickedMobile(true);
      setUserProfile(data);
    });
    setMessage("");
    setNameToBeFiltered("");

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
      <section
        className={isUserClickedMobile ? "hideSideBar sideBar" : "sideBar"}
      >
        <SideBar
          profile={myprofile}
          setIsLoggedIn={setIsLoggedIn}
          loader={loader}
        />
      </section>
      <section
        className={
          isUserClickedMobile
            ? "hideUsers groupListSection"
            : "groupListSection"
        }
      >
        <div className="HeadingName">
          <h1>TalkWise</h1>
          <div>
            <span className="material-symbols-outlined">qr_code_scanner</span>
            <span className="material-symbols-outlined">photo_camera</span>
          </div>
        </div>
        <p className="grp">Chats</p>
        <SearchInput
          setAllUsers={setAllUsers}
          nametobeFiltered={nametobeFiltered}
          setNameToBeFiltered={setNameToBeFiltered}
        />
        <div className="user-overflow">
          {loader ? (
            <LoadingSpinner />
          ) : allUsers ? (
            allUsers.map((user) => (
              <User
                key={user._id}
                user={user}
                isSelected={selectedUserId === user._id}
                onClick={() => handleUserProfile(user._id)}
                myprofile={myprofile}
                setAllUsers={setAllUsers}
              />
            ))
          ) : (
            <div style={{ fontSize: "1.2rem", marginLeft: "1rem" }}>
              <p>Sorry, user not found !!</p>
            </div>
          )}
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
              setRequestId={setRequestId}
              setIsUserClickedMobile={setIsUserClickedMobile}
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
              requestId={requestId}
              setRequestId={setRequestId}
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
