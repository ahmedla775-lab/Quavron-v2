import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useMedia from "../hooks/useMedia";

export default function LiveStudio() {
  const navigate = useNavigate();

  const videoRef = useRef(null);

  const {
    stream,
    startCamera,
    toggleMic,
    toggleCamera,
    micEnabled,
    cameraEnabled,
  } = useMedia();

  useEffect(() => {
    let mediaStream = null;

    async function init() {
      try {
        console.log("Secure:", window.isSecureContext);
        console.log("MediaDevices:", navigator.mediaDevices);

        mediaStream = await startCamera();

        if (videoRef.current && mediaStream) {
          videoRef.current.srcObject = mediaStream;
          await videoRef.current.play().catch(() => {});
        }
      } catch (err) {
        console.error(err);

        alert(
          "Unable to access camera or microphone.\n\n" +
          err.message
        );
      }
    }

    init();

    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  function endLive() {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }

    navigate("/community");
  }

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">

      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        controls={false}
        className="
          absolute
          inset-0
          h-full
          w-full
          object-cover
        "
      />

      <div
        className="
          absolute
          left-0
          right-0
          top-0
          flex
          items-center
          justify-between
          bg-gradient-to-b
          from-black/80
          to-transparent
          p-4
        "
      >
        <div>
          <h2 className="text-2xl font-bold text-white">
            LIVE
          </h2>

          <p className="text-slate-300">
            0 Viewers
          </p>
        </div>

        <button
          onClick={endLive}
          className="
            rounded-full
            bg-red-600
            px-6
            py-3
            font-semibold
            text-white
            hover:bg-red-700
          "
        >
          End Live
        </button>
      </div>

      <div
        className="
          absolute
          bottom-0
          left-0
          right-0
          flex
          items-center
          justify-center
          gap-4
          bg-gradient-to-t
          from-black/80
          to-transparent
          p-6
        "
      >
        <button
          onClick={toggleMic}
          className="
            rounded-full
            bg-slate-800
            p-4
            text-2xl
          "
        >
          {micEnabled ? "🎤" : "🔇"}
        </button>

        <button
          onClick={toggleCamera}
          className="
            rounded-full
            bg-slate-800
            p-4
            text-2xl
          "
        >
          {cameraEnabled ? "📷" : "🚫📷"}
        </button>

        <button
          className="
            rounded-full
            bg-slate-800
            p-4
            text-2xl
          "
        >
          🖥️
        </button>

        <button
          className="
            rounded-full
            bg-blue-600
            px-6
            py-3
            font-semibold
            text-white
          "
        >
          Invite
        </button>
      </div>

    </div>
  );
}
