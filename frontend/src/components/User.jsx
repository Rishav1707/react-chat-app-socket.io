/* eslint-disable react/prop-types */
const User = ({ user, onClick, isSelected }) => {
  return (
    <div
      className={isSelected ? "userFocused groupName" : "groupName"}
      onClick={onClick}
    >
      <div>
        <img src={user.profileImg} alt="GroupImg" width={45} height={45} />
      </div>
      <div>
        <h3>
          {user.firstName} {user.lastName}
        </h3>
      </div>
    </div>
  );
};

export default User;
