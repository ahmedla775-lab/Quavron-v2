import Editor from "@monaco-editor/react";

function App() {

return (

<div className="dashboard">

  {/* SIDEBAR */}

  <aside className="sidebar">

    <h2>🚀 Quavron</h2>

    <div className="explorer">

      <h3>EXPLORER</h3>

      <ul>

        <li>📁 src</li>

        <li className="nested">

          📄 App.jsx

        </li>

        <li className="nested">

          📄 main.jsx

        </li>

        <li>📁 public</li>

        <li className="nested">

          📄 favicon.ico

        </li>

        <li>📄 package.json</li>

        <li>📄 vite.config.js</li>

      </ul>

    </div>

  </aside>

  {/* MAIN */}

  <main className="main">

    {/* TOPBAR */}

    <header className="topbar">

      <h1>Cloud IDE Dashboard</h1>

      <button className="primary">

        New Project

      </button>

    </header>

    {/* CARDS */}

    <section className="cards">

      <div className="card">

        <h3>Projects</h3>

        <p>12 Active Projects</p>

      </div>

      <div className="card">

        <h3>Deployments</h3>

        <p>5 Running Apps</p>

      </div>

      <div className="card">

        <h3>AI Usage</h3>

        <p>1.2M Tokens</p>

      </div>

    </section>

    {/* REAL EDITOR */}

    <section className="editor">

      <Editor

        height="70vh"

        defaultLanguage="javascript"

        theme="vs-dark"

        defaultValue={`function hello() {

console.log("Welcome to Quavron 🚀");

}

hello();`}

        options={{

          fontSize: 16,

          minimap: {

            enabled: false

          },

          automaticLayout: true

        }}

      />

    </section>

    {/* TERMINAL */}

    <section className="terminal">

      <div className="terminal-header">

        TERMINAL

      </div>

      <div className="terminal-body">

        <p>

          user@quavron:~$

          npm run dev

        </p>

        <p>

          Starting development server...

        </p>

        <p>

          VITE v5.4 ready in 120ms 🚀

        </p>

      </div>

    </section>

  </main>

</div>

);

}

export default App;
