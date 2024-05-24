import { socket } from "../utils/createSocketHost";

/* eslint-disable react/prop-types */
const SideBar = ({ profile, setIsLoggedIn }) => {
  return (
    <div className="main">
      <div className="top">
        <span className="material-symbols-outlined">menu</span>
        <span className="material-symbols-outlined chatIcon">chat</span>
        <span className="material-symbols-outlined">call</span>
      </div>
      <div className="bottom">
        <span className="material-symbols-outlined">star</span>
        <span className="material-symbols-outlined">archive</span>
        <span
          className="material-symbols-outlined"
          onClick={() => {
            socket.emit("logout", profile._id);
            localStorage.removeItem("authtoken");
            setIsLoggedIn(false);
          }}
        >
          logout
        </span>
        <img
          src={profile.profileImg}
          alt="profilePhoto"
          width={28}
          height={28}
        />
      </div>
    </div>
  );
};

export default SideBar;
