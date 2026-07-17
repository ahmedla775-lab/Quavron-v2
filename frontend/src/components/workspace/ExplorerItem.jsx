import { useState } from "react";

import {
  ChevronDown,
  ChevronRight,
  File,
  Folder,
  FolderOpen,
} from "lucide-react";

import useWorkspace from "../../modules/workspace/hooks/useWorkspace";

export default function ExplorerItem({

  item,

  level = 0,

}) {

  const {

    activeFileId,

    setActiveFileId,

    selectedNodeId,

    setSelectedNodeId,

    actions,

  } = useWorkspace();

  const [open, setOpen] =
    useState(item.open ?? false);

  const isFolder =
    item.type === "folder";

  const selected =
    selectedNodeId === item.id;

  const active =
    activeFileId === item.id;

  function handleClick() {

    setSelectedNodeId(item.id);

    if (isFolder) {

      setOpen(!open);

      return;

    }

    setActiveFileId(item.id);

    actions.openFile(item.id);

  }

  return (

    <div>

      <div

        onClick={handleClick}

        className={`flex cursor-pointer items-center gap-2 rounded px-2 py-1 transition

        ${selected
          ? "bg-slate-700"
          : "hover:bg-slate-800"}

        ${active
          ? "text-blue-400"
          : "text-slate-200"}

        `}

        style={{

          paddingLeft:

            8 + level * 16,

        }}

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

          <File className="h-4 w-4" />

        )}

        <span className="truncate">

          {item.name}

        </span>

      </div>

      {isFolder &&
        open &&
        item.children?.map((child) => (

          <ExplorerItem

            key={child.id}

            item={child}

            level={level + 1}

          />

        ))}

    </div>

  );

}
