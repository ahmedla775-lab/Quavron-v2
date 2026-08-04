import { useLiveContext } from "../context/LiveContext";

import LiveService from "../services/LiveService";

export default function useLive() {
  const live = useLiveContext();

  async function startLive(config = {}) {
    const room = await LiveService.createLive(config);

    live.setRoom(room);
    live.setStatus("created");
    live.setIsHost(true);

    return room;
  }

  async function goLive() {
    if (!live.room) return;

    const room = await LiveService.startLive(live.room.id);

    live.setRoom(room);
    live.setStatus("live");

    return room;
  }

  async function endLive() {
    if (!live.room) return;

    await LiveService.endLive(live.room.id);

    live.setStatus("ended");
  }

  async function joinLive(roomId) {
    const viewers =
      await LiveService.joinLive(roomId);

    live.setViewers(viewers);
    live.setIsViewer(true);

    return viewers;
  }

  async function leaveLive(roomId) {
    const viewers =
      await LiveService.leaveLive(roomId);

    live.setViewers(viewers);
    live.setIsViewer(false);

    return viewers;
  }

  async function startRecording() {
    if (!live.room) return;

    await LiveService.startRecording(
      live.room.id
    );

    live.setRecording(true);
  }

  async function stopRecording() {
    if (!live.room) return;

    await LiveService.stopRecording(
      live.room.id
    );

    live.setRecording(false);
  }

  return {
    ...live,

    startLive,
    goLive,
    endLive,

    joinLive,
    leaveLive,

    startRecording,
    stopRecording,
  };
}
