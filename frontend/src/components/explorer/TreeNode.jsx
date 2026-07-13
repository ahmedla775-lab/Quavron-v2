import {
  ChevronRight,
  ChevronDown,
  Folder,
  FileCode,
  FileJson,
  FileText,
} from "lucide-react";

import { useState } from "react";

export default function TreeNode({

  item,

  onOpen,

}) {

  const [expanded, setExpanded] = useState(true);

  const isFolder = item.type === "folder";

  function getIcon() {

    if (item.type === "folder")
      return Folder;

    if (item.type === "jsx")
      return FileCode;

    if (item.type === "json")
      return FileJson;

    return FileText;

  }

  const Icon = getIcon();

  return (

    <div>

      <button

        onClick={() => {

          if (isFolder) {

            setExpanded(!expanded);

          } else {

            onOpen(item);

          }

        }}

        className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left hover:bg-slate-800"

      >

        {isFolder ? (

          expanded ?

          <ChevronDown size={16} />

          :

          <ChevronRight size={16} />

        ) : (

          <div className="w-4" />

        )}

        <Icon size={17} />

        <span>

          {item.name}

        </span>

      </button>

      {

        expanded &&

        item.children?.length > 0 && (

          <div className="ml-6">

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

  );

}

