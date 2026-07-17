import { useState } from "react";
import {
  ChevronRight,
  ChevronDown,
  Folder,
  FolderOpen,
  FileCode2,
} from "lucide-react";

import { useWorkspace } from "../../context/WorkspaceContext";

export default function ExplorerItem({ item }) {

  const [open, setOpen] = useState(item.open ?? false);

  const { openFile } = useWorkspace();

  const isFolder = !!item.children;

  function handleClick() {

    if (isFolder) {

      setOpen(!open);

      return;

    }

    openFile({

      id: item.name,

      name: item.name,

    });

  }

  return (

    <div>

      <div
        onClick={handleClick}
        className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-slate-300 transition hover:bg-slate-800"
      >

        {isFolder ? (
          open ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )
        ) : (
          <span className="w-4" />
        )}

        {isFolder ? (
          open ? (
            <FolderOpen className="h-4 w-4 text-yellow-400" />
          ) : (
            <Folder className="h-4 w-4 text-yellow-400" />
          )
        ) : (
          <FileCode2 className="h-4 w-4 text-sky-400" />
        )}

        <span>{item.name}</span>

      </div>

      {isFolder && open && (

        <div className="ml-6">

          {item.children.map((child) => (

            <ExplorerItem
              key={child.name}
              item={child}
            />

          ))}

        </div>

      )}

    </div>

  );

}
