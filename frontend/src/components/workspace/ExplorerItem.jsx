import { useState } from "react";
import {
  ChevronRight,
  ChevronDown,
  Folder,
  FolderOpen,
  FileCode2,
  FileText,
} from "lucide-react";

import useWorkspace from "../../modules/workspace/hooks/useWorkspace";

export default function ExplorerItem({
  item,
  level = 0,
  onClose,
}) {

 const {
  activeTab,
  setActiveTab,
  selectedNodeId,
  setSelectedNodeId,
  openFile,
} = useWorkspace();
  const [open, setOpen] = useState(item.open ?? true);

  const isFolder = item.type === "folder";

  const active = activeTab === item.id;
  const selected = selectedNodeId === item.id;

  function handleClick() {

    setSelectedNodeId(item.id);

    if (isFolder) {
      setOpen((v) => !v);
      return;
    }

    openFile(item.id);
    if (onClose) {
      onClose();
    }

  }

  return (
    <div>

      <div
        onClick={handleClick}
        style={{
          paddingLeft: 12 + level * 16,
        }}
        className={`
          flex
          h-8
          cursor-pointer
          items-center
          gap-2
          select-none
          transition
          ${
            active
              ? "bg-sky-600/20 text-sky-400"
              : selected
              ? "bg-slate-800 text-white"
              : "text-slate-300 hover:bg-slate-800"
          }
        `}
      >

        {isFolder ? (
          open
            ? <ChevronDown size={15} />
            : <ChevronRight size={15} />
        ) : (
          <span className="w-[15px]" />
        )}

        {isFolder ? (
          open ? (
            <FolderOpen
              size={16}
              className="text-yellow-400"
            />
          ) : (
            <Folder
              size={16}
              className="text-yellow-400"
            />
          )
        ) : item.name.endsWith(".jsx") ||
          item.name.endsWith(".tsx") ? (
          <FileCode2
            size={16}
            className="text-sky-400"
          />
        ) : (
          <FileText
            size={16}
            className="text-slate-400"
          />
        )}

        <span className="truncate text-sm">
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
            onClose={onClose}
          />
        ))}

    </div>
  );

}
