/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { socket } from "../utils/createSocketHost";

const VideoCall = ({
  peerInstance,
  currentUserVideoRef,
  remoteVideoRef,
  setOpenVideoCall,
  to,
  from,
}) => {
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);

  useEffect(() => {
    const peer = peerInstance.current;

    const handleCall = (call) => {
      var getUserMedia =
        navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia;

      getUserMedia({ video: true, audio: true }, (mediaStream) => {
        if (currentUserVideoRef.current) {
          currentUserVideoRef.current.srcObject = mediaStream;
        }

        call.answer(mediaStream);

        call.on("stream", (remoteStream) => {
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = remoteStream;
          }
        });

        peer.currentCall = call;
      });
    };

    peer.on("call", handleCall);

    return () => {
      if (peer.currentCall) {
        peer.currentCall.close();
      }
      peer.off("call", handleCall);
    };
  }, [peerInstance, currentUserVideoRef, remoteVideoRef]);

  const stopMediaStreams = (stream) => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
  };

  const endCall = () => {
    stopMediaStreams(currentUserVideoRef.current?.srcObject);
    stopMediaStreams(remoteVideoRef.current?.srcObject);
    setOpenVideoCall(false);
    socket.emit("requestedCallDecline", { to, from });
  };

  const toggleVideo = () => {
    const stream = currentUserVideoRef.current?.srcObject;
    if (stream) {
      const videoTrack = stream
        .getTracks()
        .find((track) => track.kind === "video");
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
      }
    }
  };

  const toggleAudio = () => {
    const stream = currentUserVideoRef.current?.srcObject;
    if (stream) {
      const audioTrack = stream
        .getTracks()
        .find((track) => track.kind === "audio");
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioEnabled(audioTrack.enabled);
      }
    }
  };

  return (
    <div className="videoCall">
      <div className="videoCallIndividual-current">
        <video ref={currentUserVideoRef} autoPlay />
      </div>
      <div className="videoCallIndividual-remote">
        <video ref={remoteVideoRef} autoPlay />
      </div>
      <div className="videoCallIndividual-permission">
        <div>
          <button onClick={toggleVideo}>
            <span className="material-symbols-outlined">
              {isVideoEnabled ? "videocam" : "videocam_off"}
            </span>
          </button>
          <button onClick={toggleAudio}>
            <span className="material-symbols-outlined">
              {isAudioEnabled ? "mic" : "mic_off"}
            </span>
          </button>
          <button onClick={endCall}>
            <span className="material-symbols-outlined">call_end</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoCall;
