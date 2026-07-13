import {
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";

const TerminalContext = createContext(null);

export function TerminalProvider({ children }) {

  const [lines, setLines] = useState([
    "Welcome to Quavron Terminal",
    "Type 'help' to list commands.",
  ]);

  const value = useMemo(() => ({

    lines,

    setLines,

  }), [lines]);

  return (

    <TerminalContext.Provider value={value}>

      {children}

    </TerminalContext.Provider>

  );

}

export function useTerminal() {

  const context = useContext(TerminalContext);

  if (!context) {

    throw new Error(
      "useTerminal must be used inside TerminalProvider"
    );

  }

  return context;

}
