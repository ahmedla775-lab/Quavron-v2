import { useState } from "react";

export default function CommitBox() {

  const [message, setMessage] = useState("");

  return (

    <div className="border-b border-slate-800 p-4">

      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Commit message..."
        className="h-24 w-full rounded-lg bg-slate-800 p-3 text-white outline-none"
      />

      <button
        className="mt-3 w-full rounded-lg bg-green-600 py-2 font-semibold hover:bg-green-700"
      >
        Commit
      </button>

    </div>

  );

}

