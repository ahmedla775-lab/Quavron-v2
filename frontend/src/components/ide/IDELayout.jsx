export default function IDELayout({
  explorer,
  tabs,
  editor,
  terminal,
  rightbar,
}) {
  return (
    <div className="flex h-screen bg-slate-950 text-white">

      <aside className="w-72 border-r border-slate-800">

        {explorer}

      </aside>

      <div className="flex flex-1 flex-col">

        <div>

          {tabs}

        </div>

        <div className="flex-1 overflow-hidden">

          {editor}

        </div>

        <div className="h-56 border-t border-slate-800">

          {terminal}

        </div>

      </div>

      <aside className="w-80 border-l border-slate-800">

        {rightbar}

      </aside>

    </div>
  );
}

