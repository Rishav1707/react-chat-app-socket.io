import { socket } from "../utils/createSocketHost";

/* eslint-disable react/prop-types */
const RequestPopUp = ({ setRequestId, to, from, peerId, setOpenVideoCall }) => {
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
      <h3>I want your Video and Audio access</h3>
      <button onClick={handleCallAccept}>Accept</button>
      <button onClick={handleCallDecline}>Decline</button>
    </div>
  );
};

export default RequestPopUp;
