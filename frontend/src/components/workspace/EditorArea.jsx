import { useEffect, useState } from "react";

import useEditor from "../../modules/workspace/hooks/useEditor";
import useWorkspace from "../../modules/workspace/hooks/useWorkspace";

export default function EditorArea() {

  const {

    activeFileId,

    actions,

  } = useWorkspace();

  const {

    save,

  } = useEditor();

  const file = activeFileId

    ? actions.openFile(activeFileId)

    : null;

  const [content, setContent] =
    useState("");

  useEffect(() => {

    if (file) {

      setContent(file.content || "");

    }

  }, [file]);

  useEffect(() => {

    if (!file) {

      return;

    }

    const timer = setTimeout(() => {

      save(content);

    }, 500);

    return () => clearTimeout(timer);

  }, [content]);

  if (!file) {

    return (

      <div className="flex h-full items-center justify-center bg-slate-950 text-slate-500">

        Open a file from Explorer

      </div>

    );

  }

  return (

    <div className="flex h-full flex-col bg-slate-950">

      <div className="border-b border-slate-800 px-4 py-2 text-sm text-slate-300">

        <div className="flex items-center justify-between">

          <span>

            {file.name}

          </span>

          <span className="text-xs text-slate-500">

            {file.language || "plaintext"}

          </span>

        </div>

      </div>

      <textarea

        value={content}

        onChange={(e) =>

          setContent(e.target.value)

        }

        spellCheck={false}

        className="h-full w-full resize-none bg-slate-950 p-4 font-mono text-sm text-slate-200 outline-none"

      />

    </div>

  );

}
