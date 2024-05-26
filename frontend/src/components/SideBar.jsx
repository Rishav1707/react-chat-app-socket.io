import { socket } from "../utils/createSocketHost";
import loadingImage from "../assets/imageLoading.gif";

/* eslint-disable react/prop-types */
const SideBar = ({ profile, setIsLoggedIn, loader }) => {
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
        {loader ? (
          <img
            src={loadingImage}
            alt="Image-Loading-Spinner"
            width={28}
            height={28}
          />
        ) : (
          <img
            src={profile.profileImg}
            alt="profilePhoto"
            width={28}
            height={28}
          />
        )}
      </div>
    </div>
  );
};

export default SideBar;
