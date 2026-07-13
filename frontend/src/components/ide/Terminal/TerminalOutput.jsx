import { useRef } from "react";
import TerminalHistory from "../../../core/terminal/TerminalHistory";
import { useTerminal } from "../../../context/TerminalContext";
import { useState } from "react";
import TerminalManager from "../../../core/terminal/TerminalManager";

export default function TerminalOutput() {

  const { lines, setLines } = useTerminal();
const history = useRef(new TerminalHistory());
  const [command, setCommand] = useState("");

  async function execute() {

    const input = command.trim();

    if (!input) return;
history.current.add(input);
    const result = await TerminalManager.execute(input);

    if (result === "__CLEAR__") {

      setLines([]);

      setCommand("");

      return;

    }

    setLines((prev) => [

      ...prev,

      `> ${input}`,

      result,

    ]);

    setCommand("");

  }

  return (

    <div className="flex h-full flex-col bg-black">

      <div className="flex-1 overflow-y-auto p-4 font-mono text-sm text-green-400">

        {lines.map((line, index) => (

          <div key={index}>

            {line}

          </div>

        ))}

      </div>

      <div className="border-t border-slate-800 p-3">

        <input
          value={command}
         onKeyDown={(e) => {

  if (e.key === "Enter") {

    execute();

  }

  if (e.key === "ArrowUp") {

    e.preventDefault();

    setCommand(history.current.previous());

  }

  if (e.key === "ArrowDown") {

    e.preventDefault();

    setCommand(history.current.next());

  }

}}
          placeholder="Enter command..."
          className="w-full bg-transparent font-mono text-green-400 outline-none"
        />

      </div>

    </div>

  );

}
