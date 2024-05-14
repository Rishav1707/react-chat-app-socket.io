/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import Header from "../components/Header";
import Input from "../components/Input";
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
  const [chat, setChat] = useState([]);

  useEffect(() => {
    fetchUserProfile().then((data) => {
      setMyProfile(data);
    });
  }, []);

  useEffect(() => {
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
            />
          ))}
        </div>
      </section>
      {isUserProfileClicked ? (
        <section id="chatSection">
          <div className="chatInput">
            <Header profile={userProfile} />
            <ShowChat
              chat={chat}
              setChat={setChat}
              myprofile={myprofile}
              selectedUserId={selectedUserId}
            />
          </div>
          <Input
            message={message}
            setMessage={setMessage}
            selectedUserId={selectedUserId}
            setChat={setChat}
            chat={chat}
            myprofile={myprofile}
          />
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
