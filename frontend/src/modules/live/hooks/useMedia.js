import { useState } from "react";

export default function useMedia() {

  const [stream, setStream] = useState(null);

  const [micEnabled, setMicEnabled] = useState(true);

  const [cameraEnabled, setCameraEnabled] = useState(true);

  async function startCamera() {

    const media = await navigator.mediaDevices.getUserMedia({

      video: true,

      audio: true,

    });

    setStream(media);

    return media;

  }

  function toggleMic() {

    if (!stream) return;

    stream.getAudioTracks().forEach(track => {

      track.enabled = !track.enabled;

      setMicEnabled(track.enabled);

    });

  }

  function toggleCamera() {

    if (!stream) return;

    stream.getVideoTracks().forEach(track => {

      track.enabled = !track.enabled;

      setCameraEnabled(track.enabled);

    });

  }

  async function shareScreen() {

    return await navigator.mediaDevices.getDisplayMedia({

      video: true,

    });

  }

  return {

    stream,

    micEnabled,

    cameraEnabled,

    startCamera,

    toggleMic,

    toggleCamera,

    shareScreen,

  };

}
