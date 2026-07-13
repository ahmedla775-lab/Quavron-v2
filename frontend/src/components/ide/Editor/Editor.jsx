import MonacoEditor from "@monaco-editor/react";
import { useEffect, useState } from "react";
import FileService from "../../../services/FileService";
import { useFiles } from "../../../context/FileContext";

import EmptyEditor from "./EmptyEditor";
import EditorToolbar from "./EditorToolbar";
import EditorTabs from "./EditorTabs";

export default function Editor() {
  const {
    currentFile,
    updateFile,
  } = useFiles();

  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setContent(currentFile?.content ?? "");
  }, [currentFile]);

  useEffect(() => {
    if (!currentFile) return;

    const timer = setTimeout(async () => {
      if (content === currentFile.content) return;

      setSaving(true);

      try {
        await FileService.updateFile(currentFile.id, {
          content,
        });

        updateFile(currentFile.id, content);
      } catch (err) {
        console.error(err);
      } finally {
        setSaving(false);
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [content, currentFile, updateFile]);

  if (!currentFile) {
    return <EmptyEditor />;
  }

  return (
    <div className="flex h-full flex-col bg-slate-950">
      <EditorToolbar saving={saving} />

      <EditorTabs />

      <div className="flex-1">
        <MonacoEditor
          height="100%"
          theme="vs-dark"
          language={currentFile.type}
          value={content}
          onChange={(value) => setContent(value ?? "")}
          options={{
            minimap: {
              enabled: true,
            },
            fontSize: 15,
            automaticLayout: true,
          }}
        />
      </div>
    </div>
  );
}
