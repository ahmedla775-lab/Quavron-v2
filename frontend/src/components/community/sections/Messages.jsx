import { useState } from "react";

const conversations = [
  {
    id: 1,
    name: "Quavron Team",
    lastMessage: "Welcome to Quavron!",
  },
  {
    id: 2,
    name: "Developer Community",
    lastMessage: "New project published.",
  },
];

export default function Messages() {
  const [selected, setSelected] = useState(conversations[0]);

  return (
    <div className="flex h-full bg-slate-950">
      <aside className="w-72 border-r border-slate-800 bg-slate-900">
        <h2 className="border-b border-slate-800 p-4 text-xl font-bold text-white">
          Messages
        </h2>

        {conversations.map((chat) => (
          <button
            key={chat.id}
            onClick={() => setSelected(chat)}
            className={`w-full border-b border-slate-800 p-4 text-left ${
              selected.id === chat.id
                ? "bg-blue-600 text-white"
                : "text-slate-300 hover:bg-slate-800"
            }`}
          >
            <div className="font-semibold">
              {chat.name}
            </div>

            <div className="text-sm opacity-70">
              {chat.lastMessage}
            </div>
          </button>
        ))}
      </aside>

      <main className="flex flex-1 flex-col justify-between">
        <div className="border-b border-slate-800 p-4">
          <h3 className="text-lg font-bold text-white">
            {selected.name}
          </h3>
        </div>

        <div className="flex-1 p-6 text-slate-400">
          Chat system will be connected here.
        </div>

        <div className="border-t border-slate-800 p-4">
          <input
            type="text"
            placeholder="Type a message..."
            className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none"
          />
        </div>
      </main>
    </div>
  );
}
