import { useEffect, useState } from "react";
import { socket } from "../utils/createSocketHost";
import { userById } from "../utils/backendRequest";

/* eslint-disable react/prop-types */
const RequestPopUp = ({ setRequestId, to, from, peerId, setOpenVideoCall }) => {
  const [toUser, settoUser] = useState({});

  useEffect(() => {
    userById(to).then((data) => {
      settoUser(data);
    });
  }, [to]);

  const handleCallDecline = () => {
    setRequestId(null);
    setOpenVideoCall(false);
    socket.emit("requestedCallDecline", { to, from });
  };

  const handleCallAccept = () => {
    setRequestId(null);
    setOpenVideoCall(true);
    socket.emit("requestedCallAccept", { to, from, peerId });
  };

  return (
    <div className="RequestPopUpContainer">
      <div>
        <h3>{toUser.firstName} want&apos;s your Video and Audio access</h3>
        <div className="RequestButton">
          <button onClick={handleCallAccept}>Accept</button>
          <button onClick={handleCallDecline}>Decline</button>
        </div>
      </div>
    </div>
  );
};

export default RequestPopUp;
