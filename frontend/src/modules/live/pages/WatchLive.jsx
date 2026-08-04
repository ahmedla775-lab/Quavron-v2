import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";

import LiveLayout from "../components/layout/LiveLayout";

import LiveService from "../services/LiveService";

export default function WatchLive() {
  const { roomId } = useParams();

  const videoRef = useRef(null);

  useEffect(() => {
    const room = LiveService.getRoom(roomId);

    if (!room) return;

    LiveService.joinLive(roomId);

    return () => {
      LiveService.leaveLive(roomId);
    };
  }, [roomId]);

  return (
    <LiveLayout>
      <div className="relative flex h-full w-full items-center justify-center bg-black">

        <video
          ref={videoRef}
          autoPlay
          playsInline
          controls
          className="h-full w-full object-contain"
        />

        <div className="absolute left-4 top-4 rounded-xl bg-red-600 px-3 py-2 font-semibold text-white">
          LIVE
        </div>

      </div>
    </LiveLayout>
  );
}
