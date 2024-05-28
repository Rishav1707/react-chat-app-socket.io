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
  setOpenVideoCall,
  setRequestId,
  setIsUserClickedMobile,
}) => {
  const [senderID, setSenderID] = useState(null);
  const [accept, setAccept] = useState(false);
  const [declined, setDeclined] = useState(false);
  const [requestPeerId, setRequestPeerId] = useState(null);

  const call = (remotePeerId) => {
    var getUserMedia =
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia;

    getUserMedia({ video: true, audio: true }, (mediaStream) => {
      currentUserVideoRef.current.srcObject = mediaStream;

      const call = peerInstance.current.call(remotePeerId, mediaStream);

      call.on("stream", (remoteStream) => {
        remoteVideoRef.current.srcObject = remoteStream;
      });
    });
  };

  const stopMediaStreams = (stream) => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
  };

  const endCall = () => {
    stopMediaStreams(currentUserVideoRef.current?.srcObject);
    stopMediaStreams(remoteVideoRef.current?.srcObject);
    setRequestId(null);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    socket.on("requestedCallDecline", (from) => {
      setDeclined(true);
      setOpenVideoCall(false);
      endCall();
      setRequestPeerId(from);
      setTimeout(() => {
        setDeclined(false);
        setRequestPeerId(null);
      }, 3000);
    });

    socket.on("requestedCallAccept", ({ from, peerId }) => {
      call(peerId);
      setAccept(true);
      setRequestPeerId(from);
      setTimeout(() => {
        setAccept(false);
        setRequestPeerId(null);
      }, 3000);
    });

    return () => {
      socket.off("requestedCallDecline");
      socket.off("requestedCallAccept");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <header>
      <div className="arrowBack" onClick={() => setIsUserClickedMobile(false)}>
        <span className="material-symbols-outlined">arrow_back_ios</span>
      </div>
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
          <p>{declined && requestPeerId === profile._id && "Call Declined"}</p>
          <p>{accept && requestPeerId === profile._id && "Call Accepted"}</p>
        </div>
      </div>
      <div id="communication">
        <button
          onClick={() => {
            socket.emit("requestVideoCall", {
              to: profile._id,
              from: myprofile._id,
            });
            setOpenVideoCall(true);
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
