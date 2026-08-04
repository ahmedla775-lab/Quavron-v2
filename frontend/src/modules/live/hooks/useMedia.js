import { useState } from "react";

export default function useMedia() {
  const [stream, setStream] = useState(null);
  const [micEnabled, setMicEnabled] = useState(true);
  const [cameraEnabled, setCameraEnabled] = useState(true);

  async function startCamera(constraints = {}) {
    const media = await navigator.mediaDevices.getUserMedia({
      video: constraints.video ?? true,
      audio: constraints.audio ?? true,
    });

    setStream(media);
    return media;
  }

  function stopStream() {
    if (!stream) return;

    stream.getTracks().forEach((track) => track.stop());
    setStream(null);
  }

  function toggleMic() {
    if (!stream) return;

    stream.getAudioTracks().forEach((track) => {
      track.enabled = !track.enabled;
      setMicEnabled(track.enabled);
    });
  }

  function toggleCamera() {
    if (!stream) return;

    stream.getVideoTracks().forEach((track) => {
      track.enabled = !track.enabled;
      setCameraEnabled(track.enabled);
    });
  }

  async function shareScreen() {
    return navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: false,
    });
  }

  async function switchCamera(deviceId) {
    const media = await navigator.mediaDevices.getUserMedia({
      video: {
        deviceId: {
          exact: deviceId,
        },
      },
      audio: true,
    });

    setStream(media);
    return media;
  }

  return {
    stream,
    setStream,
    micEnabled,
    cameraEnabled,
    startCamera,
    stopStream,
    toggleMic,
    toggleCamera,
    shareScreen,
    switchCamera,
  };
}
