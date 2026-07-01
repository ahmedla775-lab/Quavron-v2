import { useState } from "react";
import Editor from "@monaco-editor/react";

function IDE() {

  const initialFiles = {

    "App.jsx": `export default function App() {
  return (
    <h1>
      Welcome To Quavron 🚀
    </h1>
  );
}`,

    "main.jsx": `import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./style.css";

ReactDOM.createRoot(
  document.getElementById("root")
).render(<App />);`,

    "style.css": `body {
  background:#0f172a;
  color:white;
  font-family:Arial;
}`,

    "package.json": `{
  "name":"quavron",
  "version":"1.0.0"
}`

  };

  const [files, setFiles] =
    useState(initialFiles);

  const [activeFile, setActiveFile] =
    useState("App.jsx");

  const [openedTabs, setOpenedTabs] =
    useState(["App.jsx"]);

  const [prompt, setPrompt] =
    useState("");

  const [messages, setMessages] =
    useState([
      {
        role: "ai",
        text: "Welcome to Quavron AI 🚀"
      }
    ]);

  /* OPEN FILE */

  const openFile = (file) => {

    setActiveFile(file);

    if (!openedTabs.includes(file)) {

      setOpenedTabs([
        ...openedTabs,
        file
      ]);

    }

  };

  /* UPDATE CODE */

  const updateCode = (value) => {

    setFiles({
      ...files,
      [activeFile]: value
    });

  };

  /* CREATE FILE */

  const createFile = () => {

    const name =
      prompt || "NewFile.js";

    if (files[name]) return;

    setFiles({
      ...files,
      [name]: "// New File 🚀"
    });

    setActiveFile(name);

    setOpenedTabs([
      ...openedTabs,
      name
    ]);

    setPrompt("");

  };

  /* DELETE FILE */

  const deleteFile = (file) => {

    const updated = { ...files };

    delete updated[file];

    setFiles(updated);

    const filteredTabs =
      openedTabs.filter(
        (tab) => tab !== file
      );

    setOpenedTabs(filteredTabs);

    const firstFile =
      Object.keys(updated)[0];

    setActiveFile(firstFile);

  };

  /* AI */

  const generateAI = () => {

    if (!prompt) return;

    let generated = "";

    if (
      prompt.toLowerCase().includes("login")
    ) {

      generated = `export default function Login() {
  return (
    <div className="login-page">
      <h1>Login</h1>

      <input
        type="email"
        placeholder="Email"
      />

      <input
        type="password"
        placeholder="Password"
      />

      <button>
        Login
      </button>

    </div>
  );
}`;

    }

    else if (
      prompt.toLowerCase().includes("dashboard")
    ) {

      generated = `export default function Dashboard() {
  return (
    <div>
      Dashboard UI 🚀
    </div>
  );
}`;

    }

    else {

      generated = `export default function Component() {
  return (
    <div>
      AI Component 🚀
    </div>
  );
}`;

    }

    setFiles({
      ...files,
      [activeFile]: generated
    });

    setMessages([
      ...messages,
      {
        role: "user",
        text: prompt
      },
      {
        role: "ai",
        text:
          "Component generated successfully 🚀"
      }
    ]);

    setPrompt("");

  };

  return (

    <div className="ide-layout">

      {/* FILES */}

      <div className="files-panel">
<div className="explorer-section">

  <p>📁 src</p>

  <p className="nested">
    📁 components
  </p>

  <p className="nested">
    📁 pages
  </p>

</div>
        <div className="files-header">

          <h3>FILES</h3>

          <button
            className="new-file-btn"
            onClick={createFile}
          >
            +
          </button>

        </div>

        {Object.keys(files).map((file) => (

          <div
            key={file}
            className={
              activeFile === file
                ? "file active"
                : "file"
            }
          >

            <span
              onClick={() => openFile(file)}
            >
              📄 {file}
            </span>

            <button
              className="delete-btn"
              onClick={() => deleteFile(file)}
            >
              ×
            </button>

          </div>

        ))}

      </div>

      {/* EDITOR */}

      <div className="editor-panel">

        <div className="editor-topbar">

          <span>{activeFile}</span>

          <button className="run-btn">
            ▶ Run
          </button>

        </div>

        {/* TABS */}

        <div className="tabs">

          {openedTabs.map((tab) => (

            <div
              key={tab}
              className={
                activeFile === tab
                  ? "tab active-tab"
                  : "tab"
              }
              onClick={() =>
                setActiveFile(tab)
              }
            >

              {tab}

            </div>

          ))}

        </div>

        <Editor
          height="500px"
          theme="vs-dark"
          language="javascript"
          value={files[activeFile]}
          onChange={updateCode}
        />

        {/* TERMINAL */}

        <div className="terminal">

          <div className="terminal-header">
            TERMINAL
          </div>
{/* STATUS BAR */}

<div className="statusbar">

  <div>
    🌿 main
  </div>

  <div>
    UTF-8 • JavaScript • Vite
  </div>

</div>
          <div className="terminal-body">

            <p>
              user@quavron:~$ npm run dev
            </p>

            <p>
              VITE v5.4 ready 🚀
            </p>

            <p>
              localhost:5173 running...
            </p>

          </div>

        </div>

      </div>

      {/* PREVIEW */}

      <div className="preview-panel">

        <div className="preview-header">

          🌐 Live Preview

        </div>

        <iframe
          title="preview"
          className="preview-frame"
          srcDoc={`
<html>
<head>
<style>
${files["style.css"] || ""}
</style>
</head>

<body>

<div id="root">

${files["App.jsx"]
  ?.replace(
    "export default function App() {",
    ""
  )
  ?.replace("return (", "")
  ?.replace(");", "")
  ?.replace("}", "")
}

<p style="color:#94a3b8">
Quavron Rendering Engine
</p>

</div>

</body>
</html>
`}
        />

      </div>

      {/* AI */}

      <div className="ai-sidebar">

        <div className="ai-header">
          🤖 Quavron AI
        </div>

        <div className="ai-chat">

          {messages.map((msg, index) => (

            <div
              key={index}
              className={
                msg.role === "user"
                  ? "ai-message user"
                  : "ai-message"
              }
            >

              <strong>
                {msg.role === "user"
                  ? "You"
                  : "AI"}:
              </strong>

              {" "}

              {msg.text}

            </div>

          ))}

        </div>

        <div className="ai-input">

          <input
            type="text"
            placeholder="Ask Quavron AI..."
            value={prompt}
            onChange={(e) =>
              setPrompt(e.target.value)
            }
          />

          <button onClick={generateAI}>
            Send
          </button>

        </div>

      </div>

    </div>

  );

}

export default IDE;
