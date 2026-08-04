import {
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";

const LiveContext = createContext(null);

export function LiveProvider({ children }) {
  const [room, setRoom] = useState(null);
  const [stream, setStream] = useState(null);

  const [participants, setParticipants] = useState([]);

  const [viewers, setViewers] = useState(0);

  const [status, setStatus] = useState("idle");

  const [timer, setTimer] = useState(0);

  const [bandwidth, setBandwidth] = useState(0);

  const [quality, setQuality] = useState("480p");

  const [recording, setRecording] = useState(false);

  const [isHost, setIsHost] = useState(false);

  const [isViewer, setIsViewer] = useState(false);

  const resetLive = () => {
    setRoom(null);
    setStream(null);
    setParticipants([]);
    setViewers(0);
    setStatus("idle");
    setTimer(0);
    setBandwidth(0);
    setQuality("480p");
    setRecording(false);
    setIsHost(false);
    setIsViewer(false);
  };

  const value = useMemo(
    () => ({
      room,
      setRoom,

      stream,
      setStream,

      participants,
      setParticipants,

      viewers,
      setViewers,

      status,
      setStatus,

      timer,
      setTimer,

      bandwidth,
      setBandwidth,

      quality,
      setQuality,

      recording,
      setRecording,

      isHost,
      setIsHost,

      isViewer,
      setIsViewer,

      resetLive,
    }),
    [
      room,
      stream,
      participants,
      viewers,
      status,
      timer,
      bandwidth,
      quality,
      recording,
      isHost,
      isViewer,
    ]
  );

  return (
    <LiveContext.Provider value={value}>
      {children}
    </LiveContext.Provider>
  );
}

export function useLiveContext() {
  const context = useContext(LiveContext);

  if (!context) {
    throw new Error(
      "useLiveContext must be used inside LiveProvider"
    );
  }

  return context;
}
