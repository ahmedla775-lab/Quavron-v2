import { useState } from "react";
import RenameDialog from "../Dialog/RenameDialog";
import { useFiles } from "../../../context/FileContext";
import {
  ChevronDown,
  ChevronRight,
  Folder,
  FolderOpen,
  FileCode2,
  FileJson,
  FileText,
} from "lucide-react";

import FileContextMenu from "../ContextMenu/FileContextMenu";

export default function TreeNode({
  item,
  onOpen,
}) {

  const [expanded, setExpanded] = useState(true);

  const [menuOpen, setMenuOpen] = useState(false);

const [showRename, setShowRename] = useState(false);
const {
  renameFile,
  deleteFile,
} = useFiles();
  const [position, setPosition] = useState({
    x: 0,
    y: 0,
  });

  const isFolder = item.type === "folder";

  function getIcon() {

    if (item.type === "folder")
      return expanded ? FolderOpen : Folder;

    if (item.type === "jsx")
      return FileCode2;

    if (item.type === "json")
      return FileJson;

    return FileText;

  }

  const Icon = getIcon();

  function handleContextMenu(e) {

    e.preventDefault();

    setPosition({

      x: e.clientX,

      y: e.clientY,

    });

    setMenuOpen(true);

  }

  return (
    <>

      <div>

        <button
          onContextMenu={handleContextMenu}
          onClick={() => {

            if (isFolder) {

              setExpanded(!expanded);

            } else {

              onOpen(item);

            }

          }}
          className="flex w-full items-center gap-2 rounded-md px-2 py-2 hover:bg-slate-800"
        >

          {isFolder ? (

            expanded

              ? <ChevronDown size={15} />

              : <ChevronRight size={15} />

          ) : (

            <div className="w-[15px]" />

          )}

          <Icon size={17} />

          <span>{item.name}</span>

        </button>

        {

          expanded &&
          item.children?.length > 0 && (

            <div className="ml-5">

              {

                item.children.map((child) => (

                  <TreeNode
                    key={child.id}

                    item={child}

                    onOpen={onOpen}

                  />

                ))

              }

            </div>

          )

        }

      </div>

      <FileContextMenu

        open={menuOpen}

        x={position.x}

        y={position.y}

        onClose={() => setMenuOpen(false)}

        onNewFile={() => {}}

        onNewFolder={() => {}}

        onRename={() => setShowRename(true)}
        onDelete={async () => {

  const ok = confirm(
    `Delete "${item.name}" ?`
  );

  if (!ok) return;

  try {

    await deleteFile(item.id);

  } catch (err) {

    alert(err.message);

  }

}}
      />
<RenameDialog
  open={showRename}
  value={item.name}
  onClose={() => setShowRename(false)}
  onSave={async (name) => {

  try {

    await renameFile(item.id, name);

    setShowRename(false);

  } catch (err) {

    alert(err.message);

  }

}}
/>
    </>

  );

}
