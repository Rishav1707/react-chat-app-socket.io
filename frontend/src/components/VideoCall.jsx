/* eslint-disable react/prop-types */
import { useEffect } from "react";

const VideoCall = ({ peerInstance, currentUserVideoRef, remoteVideoRef }) => {
  useEffect(() => {
    peerInstance.current.on("call", (call) => {
      var getUserMedia =
        navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia;

      getUserMedia({ video: true, audio: false }, (mediaStream) => {
        currentUserVideoRef.current.srcObject = mediaStream;
        currentUserVideoRef.current.play();

        call.answer(mediaStream);
        call.on("stream", function (remoteStream) {
          remoteVideoRef.current.srcObject = remoteStream;
          remoteVideoRef.current.play();
        });
      });
    });
  }, []);

  return (
    <div className="videoCall">
      <div className="videoCallIndividual-current">
        <video ref={currentUserVideoRef} />
      </div>
      <div className="videoCallIndividual-remote">
        <video ref={remoteVideoRef} />
      </div>
    </div>
  );
};

export default VideoCall;
