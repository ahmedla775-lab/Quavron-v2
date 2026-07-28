import { createContext, useContext, useState } from "react";

const LiveContext = createContext();

export function LiveProvider({ children }) {

  const [room, setRoom] = useState(null);

  const [stream, setStream] = useState(null);

  const [participants, setParticipants] = useState([]);

  return (

    <LiveContext.Provider

      value={{

        room,

        setRoom,

        stream,

        setStream,

        participants,

        setParticipants,

      }}

    >

      {children}

    </LiveContext.Provider>

  );

}

export function useLive(){

  return useContext(LiveContext);

}
