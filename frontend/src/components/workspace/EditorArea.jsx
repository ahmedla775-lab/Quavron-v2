import { useEffect, useMemo, useRef, useState } from "react";

import CodeMirror from "@uiw/react-codemirror";
import { oneDark } from "@codemirror/theme-one-dark";
import { githubLight } from "@uiw/codemirror-theme-github";
import { useTheme } from "../../theme/ThemeProvider";

import { javascript } from "@codemirror/lang-javascript";
import { json } from "@codemirror/lang-json";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { markdown } from "@codemirror/lang-markdown";

import { keymap } from "@codemirror/view";
import { defaultKeymap } from "@codemirror/commands";
import { searchKeymap } from "@codemirror/search";
import { autocompletion } from "@codemirror/autocomplete";

import EmptyEditor from "./EmptyEditor";
import MobileEditorToolbar from "./MobileEditorToolbar";

import useWorkspace from "../../modules/workspace/hooks/useWorkspace";

export default function EditorArea() {
  const {
    activeTab,
    actions,
  } = useWorkspace();

  const { isDark } = useTheme();

  const file = activeTab
    ? actions.openFile(activeTab)
    : null;

  const editorRef = useRef(null);

  const [content, setContent] = useState("");

  useEffect(() => {
    if (file) {
      setContent(file.content || "");
    }
  }, [file]);

  useEffect(() => {
    if (!file) return;

    const timer = setTimeout(() => {
      actions.saveFile(activeTab, content);
    }, 300);

    return () => clearTimeout(timer);
  }, [content, activeTab, file]);

  const extensions = useMemo(() => {
    const ext = [
      keymap.of([
        ...defaultKeymap,
        ...searchKeymap,
      ]),
      autocompletion(),
    ];

    if (!file) return ext;

    switch (file.language) {
      case "javascript":
      case "js":
      case "jsx":
        ext.unshift(
          javascript({
            jsx: true,
          })
        );
        break;

      case "typescript":
      case "ts":
      case "tsx":
        ext.unshift(
          javascript({
            jsx: true,
            typescript: true,
          })
        );
        break;

      case "json":
        ext.unshift(json());
        break;

      case "html":
        ext.unshift(html());
        break;

      case "css":
        ext.unshift(css());
        break;

      case "md":
      case "markdown":
        ext.unshift(markdown());
        break;
    }

    return ext;
  }, [file]);  function insertText(text) {
    const view = editorRef.current;

    if (!view) return;

    const insert = text === "Tab" ? "  " : text;

    const { state } = view;
    const { from, to } = state.selection.main;

    view.dispatch({
      changes: {
        from,
        to,
        insert,
      },
      selection: {
        anchor: from + insert.length,
      },
    });

    view.focus();
  }

  if (!file) {
    return <EmptyEditor />;
  }

  return (
    <div className="flex h-full w-full flex-col bg-white dark:bg-[#1e1e1e]">
      <div className="flex h-10 items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4">
        <span className="text-sm font-medium text-slate-900 dark:text-white">
          {file.name}
        </span>

        <span className="text-xs text-slate-600 dark:text-slate-400">
          {file.language || "plaintext"}
        </span>
      </div>

      <div className="flex-1 h-full overflow-hidden">
        <CodeMirror
          value={content}
          height="100%"
          theme={isDark ? oneDark : githubLight}
          extensions={extensions}
          onCreateEditor={(view) => {
            editorRef.current = view;
          }}
          onChange={(value) => {
            setContent(value);
          }}
          style={{
            fontSize: 15,
            height: "100%",
          }}
          basicSetup={{
            lineNumbers: true,
            foldGutter: true,
            highlightActiveLine: true,
            highlightActiveLineGutter: true,
            highlightSelectionMatches: true,
            autocompletion: true,
            bracketMatching: true,
            closeBrackets: true,
            indentOnInput: true,
            tabSize: 2,
          }}
        />
      </div>

      <MobileEditorToolbar
        onInsert={insertText}
      />
    </div>
  );
}
