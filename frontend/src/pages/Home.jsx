/* eslint-disable react/prop-types */
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/Home.css";

const Home = (props) => {
  const {
    socket,
    socketID,
    setsocketID,
    RoomName,
    setRoomName,
    userName,
    setUserName,
  } = props;
  const navigate = useNavigate();

  useEffect(() => {
    socket.on("connect", () => {
      setsocketID(socket.id);
      console.log("Connected to server: ", socket.id);
    });
  }, [setsocketID, socket]);

  const joinRoomHandler = (e) => {
    e.preventDefault();
    if (!RoomName) return;
    socket.emit("joinRoom", { RoomName, userName });
    navigate(`/room/${RoomName}/${socketID}`);
  };

  return (
    <>
      <h1>Chat App</h1>
      <main id="joinLobby">
        <h1>Join Room</h1>
        <form onSubmit={joinRoomHandler}>
          <input
            type="text"
            name="userName"
            placeholder="Enter username"
            onChange={(e) => setUserName(e.target.value)}
          />
          <input
            type="text"
            name="roomName"
            placeholder="Enter room name"
            onChange={(e) => setRoomName(e.target.value)}
          />
          <button type="submit">Join</button>
        </form>
      </main>
    </>
  );
};

export default Home;
