import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import useMedia from "../hooks/useMedia";
import useLive from "../hooks/useLive";

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
    stopStream,
  } = useMedia();

  const {
    room,
    viewers,
    timer,
    status,
    startLive,
    goLive,
    endLive,
  } = useLive();

  useEffect(() => {
    let media = null;

    async function init() {
      media = await startCamera();

      if (videoRef.current && media) {
        videoRef.current.srcObject = media;
        await videoRef.current.play().catch(() => {});
      }

      const created = await startLive({
        title: "Live",
        category: "public",
        plan: "FREE",
      });

      await goLive(created?.id);
    }

    init();

    return () => {
      if (media) {
        media.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  async function handleEndLive() {
    await endLive();

    stopStream();

    navigate("/community");
  }

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">

      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div className="absolute left-0 right-0 top-0 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent p-4">

        <div>
          <h2 className="text-2xl font-bold text-white">
            LIVE
          </h2>

          <p className="text-slate-300">
            {viewers} Viewers
          </p>

          <p className="text-slate-400 text-sm">
            {status}
          </p>

          <p className="text-slate-400 text-sm">
            {timer}s
          </p>

          {room && (
            <p className="text-xs text-slate-500">
              {room.id}
            </p>
          )}
        </div>

        <button
          onClick={handleEndLive}
          className="rounded-full bg-red-600 px-6 py-3 font-semibold text-white hover:bg-red-700"
        >
          End Live
        </button>

      </div>

      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center gap-4 bg-gradient-to-t from-black/80 to-transparent p-6">

        <button
          onClick={toggleMic}
          className="rounded-full bg-slate-800 p-4 text-2xl"
        >
          {micEnabled ? "🎤" : "🔇"}
        </button>

        <button
          onClick={toggleCamera}
          className="rounded-full bg-slate-800 p-4 text-2xl"
        >
          {cameraEnabled ? "📷" : "🚫📷"}
        </button>

        <button
          className="rounded-full bg-slate-800 p-4 text-2xl"
        >
          🖥️
        </button>

        <button
          className="rounded-full bg-blue-600 px-6 py-3 font-semibold text-white"
        >
          Invite
        </button>

      </div>

    </div>
  );
}
