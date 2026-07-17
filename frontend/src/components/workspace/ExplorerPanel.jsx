import {
  ChevronRight,
  ChevronDown,
  Folder,
  FolderOpen,
  FileCode2,
} from "lucide-react";

const files = [
  {
    name: "src",
    open: true,
    children: [
      {
        name: "components",
        folder: true,
      },
      {
        name: "pages",
        folder: true,
      },
      {
        name: "App.jsx",
      },
      {
        name: "main.jsx",
      },
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

          <div key={item.name} className="mb-1">

            <div className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-slate-300 transition hover:bg-slate-800">

              {"children" in item ? (

                item.open ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )

              ) : (

                <span className="w-4" />

              )}

              {"children" in item ? (

                item.open ? (
                  <FolderOpen className="h-4 w-4 text-yellow-400" />
                ) : (
                  <Folder className="h-4 w-4 text-yellow-400" />
                )

              ) : (

                <FileCode2 className="h-4 w-4 text-sky-400" />

              )}

              <span>{item.name}</span>

            </div>

            {"children" in item &&
              item.open && (

                <div className="ml-7 mt-1 space-y-1">

                  {item.children.map((child) => (

                    <div
                      key={child.name}
                      className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
                    >

                      {child.folder ? (

                        <Folder className="h-4 w-4 text-yellow-400" />

                      ) : (

                        <FileCode2 className="h-4 w-4 text-sky-400" />

                      )}

                      <span>{child.name}</span>

                    </div>

                  ))}

                </div>

              )}

          </div>

        ))}

      </div>

    </div>

  );

}
