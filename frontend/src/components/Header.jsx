/* eslint-disable react/prop-types */

import { useEffect, useState } from "react";
import { socket } from "../utils/createSocketHost";

const Header = ({
  profile,
  setIsTyping,
  isTyping,
  myprofile,
  peerInstance,
  remoteVideoRef,
  currentUserVideoRef,
}) => {
  const [senderID, setSenderID] = useState(null);
  const [accept, setAccept] = useState(false);
  const [declined, setDeclined] = useState(false);
  const [requestId, setRequestId] = useState(null);

  const call = (remotePeerId) => {
    var getUserMedia =
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia;

    console.log(getUserMedia);

    getUserMedia({ video: true, audio: false }, (mediaStream) => {
      currentUserVideoRef.current.srcObject = mediaStream;
      currentUserVideoRef.current.play();

      const call = peerInstance.current.call(remotePeerId, mediaStream);

      call.on("stream", (remoteStream) => {
        console.log(remoteStream);
        remoteVideoRef.current.srcObject = remoteStream;
        remoteVideoRef.current.play();
      });
    });
  };

  useEffect(() => {
    socket.on("typing...", (from) => {
      setIsTyping(true);
      setSenderID(from);
    });

    socket.on("stopTyping", () => {
      setIsTyping(false);
    });

    return () => {
      socket.off("typing...");
      socket.off("stopTyping");
    };
  }, []);

  useEffect(() => {
    socket.on("requestedCallDecline", (from) => {
      setDeclined(true);
      setRequestId(from);
      setTimeout(() => {
        setDeclined(false);
        setRequestId(null);
      }, 3000);
    });

    socket.on("requestedCallAccept", ({ from, peerId }) => {
      call(peerId);
      setAccept(true);
      setRequestId(from);
      setTimeout(() => {
        setAccept(false);
        setRequestId(null);
      }, 3000);
    });

    return () => {
      socket.off("requestedCallDecline");
      socket.off("requestedCallAccept");
    };
  }, []);

  return (
    <header>
      <div className="profile">
        <img
          src={profile.profileImg}
          alt="profilePhoto"
          width={45}
          height={45}
        />
        <div className="header-name">
          <p>
            {profile.firstName} {profile.lastName}
          </p>
          <p>{isTyping && senderID === profile._id ? "typing..." : ""}</p>
          <p>{declined && requestId === profile._id && "Call Declined"}</p>
          <p>{accept && requestId === profile._id && "Call Accepted"}</p>
        </div>
      </div>
      <div id="communication">
        <button
          onClick={() => {
            socket.emit("requestVideoCall", {
              to: profile._id,
              from: myprofile._id,
            });
          }}
        >
          <span className="material-symbols-outlined">videocam</span>
        </button>
        <span className="verticalLine">{"|"}</span>
        <button>
          <span className="material-symbols-outlined">call</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
