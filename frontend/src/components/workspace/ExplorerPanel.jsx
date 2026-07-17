import ExplorerItem from "./ExplorerItem";

const files = [
  {
    name: "src",
    open: true,
    children: [
      {
        name: "components",
        open: true,
        children: [
          {
            name: "workspace",
            open: false,
            children: [
              { name: "ActivityBar.jsx" },
              { name: "EditorArea.jsx" },
              { name: "TerminalPanel.jsx" },
            ],
          },
        ],
      },
      {
        name: "pages",
        open: false,
        children: [
          { name: "IDE.jsx" },
          { name: "Dashboard.jsx" },
          { name: "Profile.jsx" },
        ],
      },
      { name: "App.jsx" },
      { name: "main.jsx" },
    ],
  },
  {
    name: "public",
    open: false,
    children: [],
  },
  {
    name: "package.json",
  },
];

export default function ExplorerPanel() {

  return (

    <div className="h-full overflow-y-auto bg-slate-900">

      <div className="border-b border-slate-800 p-4">

        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400">

          Explorer

        </h2>

      </div>

      <div className="p-2">

        {files.map((item) => (

          <ExplorerItem
            key={item.name}
            item={item}
          />

        ))}

      </div>

    </div>

  );

}
