/* eslint-disable react/prop-types */
import { useEffect } from "react";
import Input from "../components/Input";
import ShowChat from "../components/ShowChat";
import GroupName from "../components/GroupName";
import Header from "../components/Header";
import "./styles/Join.css";

const Join = (props) => {
  const { socket, messages, setMessages, chat, setChat, RoomName } = props;

  useEffect(() => {
    socket.on("username", (messages) => {
      setChat([...chat, { messages, id: "username" }]);
    });
  }, [chat, setChat, socket]);

  return (
    <main id="private_room">
      <section id="groupListSection">
        <p className="grp">Groups</p>
        <GroupName />
        <GroupName />
        <GroupName />
        <GroupName />
        <GroupName />
        <GroupName />
        <GroupName />
        <GroupName />
        <GroupName />
        <GroupName />
        <GroupName />
        <GroupName />
      </section>
      <section id="chatSection">
        <div className="chatInput">
          <Header RoomName={RoomName} />
          <ShowChat socket={socket} chat={chat} setChat={setChat} />
        </div>
        <Input
          socket={socket}
          messages={messages}
          setMessages={setMessages}
          RoomName={RoomName}
        />
      </section>
    </main>
  );
};

export default Join;
