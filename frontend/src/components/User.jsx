/* eslint-disable react/prop-types */
const User = ({ user, onClick, isSelected, myprofile }) => {
  return (
    <div
      className={isSelected ? "userFocused groupName" : "groupName"}
      onClick={onClick}
    >
      <div>
        <img src={user.profileImg} alt="GroupImg" width={45} height={45} />
      </div>
      <div>
        <div>
          <h3>
            {user.firstName} {user.lastName}
          </h3>
        </div>
        {user.lastMessage && (
          <>
            {user.lastMessage.map((msg) => (
              <div className="lastMessageTime" key={msg.to}>
                {/* {msg.message?.sender === myprofile._id ? "You" : user.firstName} */}
                <p>
                  {msg.to === myprofile._id &&
                    (msg.message.message.length > 47
                      ? msg.message.message.substring(0, 47) + "..."
                      : msg.message.message)}
                </p>
                <p>{msg.message.time.split(" ")[4].substring(0, 5)}</p>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default User;
