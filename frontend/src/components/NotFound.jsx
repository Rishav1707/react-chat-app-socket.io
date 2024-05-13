import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "1rem",
      }}
    >
      <h1>404 Not Found</h1>
      <p>Sorry, an error has occured, Requested page not found!</p>
      <Link to="/user/chat">Back to Chat</Link>
    </div>
  );
};

export default NotFound;
