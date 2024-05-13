import helloVideo from "../assets/Hello.mp4";

const StartSkeleton = () => {
  return (
    <div className="helloVideoContainer">
      <video width="492" height="400" autoPlay loop>
        <source src={helloVideo} type="video/mp4" />
      </video>
      <p>
        Send and receive messages in real time, making it easier to connect with
        people anywhere in the world.
      </p>
    </div>
  );
};

export default StartSkeleton;
