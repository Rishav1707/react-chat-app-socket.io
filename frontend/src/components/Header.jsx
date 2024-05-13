/* eslint-disable react/prop-types */

const Header = ({ profile }) => {
  return (
    <header>
      <div className="profile">
        <img
          src={profile.profileImg}
          alt="profilePhoto"
          width={45}
          height={45}
        />
        <p>
          {profile.firstName} {profile.lastName}
        </p>
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
