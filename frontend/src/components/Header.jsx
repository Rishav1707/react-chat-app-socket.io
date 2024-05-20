/* eslint-disable react/prop-types */

import { useEffect, useState } from "react";
import { socket } from "../utils/createSocketHost";

const Header = ({ profile, setIsTyping, isTyping }) => {
  const [senderID, setSenderID] = useState(null);

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
  }, [isTyping]);

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
        </div>
      </div>
      <div id="communication">
        <button>
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
