/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import Header from "../components/Header";
import {
  fetchUserProfile,
  fetchAllUsers,
  userById,
} from "../utils/backendRequest";
import User from "../components/User";
import SideBar from "../components/SideBar";
import StartSkeleton from "../components/StartSkeleton";
import { socket } from "../utils/createSocketHost";
import ShowChat from "../components/ShowChat";
import "./styles/Join.css";

const UserChat = ({ setIsLoggedIn }) => {
  const [myprofile, setMyProfile] = useState({});
  const [allUsers, setAllUsers] = useState([]);
  const [isUserProfileClicked, setIsUserProfileClicked] = useState(false);
  const [userProfile, setUserProfile] = useState({});
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

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
              isTyping={isTyping}
              setIsTyping={setIsTyping}
            />
            <ShowChat
              myprofile={myprofile}
              setMyProfile={setMyProfile}
              selectedUserId={selectedUserId}
              message={message}
              setMessage={setMessage}
              setAllUsers={setAllUsers}
              setIsTyping={setIsTyping}
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
