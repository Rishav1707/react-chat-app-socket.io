import { Fragment } from "react";

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
        <div>
          {user.lastMessage?.map((msg) => (
            <Fragment key={msg.to}>
              {msg.to === myprofile._id &&
                msg.message &&
                (msg.message.message.length > 42 ? (
                  <p className="lastMessage">
                    {msg.message.message.substring(0, 42) + "..."}
                  </p>
                ) : (
                  <p className="lastMessage">{msg.message.message}</p>
                ))}
              {msg.message &&
                (msg.message.users[0] === myprofile._id ||
                  msg.message.users[1] === myprofile._id) && (
                  <p className="lastMessageTime">
                    {msg.message.time.split(" ")[4].substring(0, 5)}
                  </p>
                )}
            </Fragment>
          ))}
        </div>
        {myprofile.unreadMsgCount?.map((unread) => (
          <Fragment key={unread.from}>
            {unread.from === user._id && unread.count > 0 && (
              <span className="count">{unread.count}</span>
            )}
          </Fragment>
        ))}
      </div>
    </div>
  );
};

export default User;
