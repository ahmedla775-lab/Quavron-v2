import {
Routes,
Route,
NavLink
} from "react-router-dom";

/* PAGES */

import Dashboard from "./pages/Dashboard";
import IDE from "./pages/IDE";
import Courses from "./pages/Courses";
import Community from "./pages/Community";
import Marketplace from "./pages/Marketplace";
import Hosting from "./pages/Hosting";
import Freelance from "./pages/Freelance";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";

function App() {

return (

<div className="dashboard">

  {/* SIDEBAR */}

  <aside className="sidebar">

    <div>

      <h2>🚀 Quavron</h2>

      <p className="subtitle">
        Next Generation Platform
      </p>

    </div>

    {/* NAVIGATION */}

    <nav className="nav">

      <h3>PLATFORM</h3>

      <ul>

        <li>
          <NavLink to="/">
            🏠 Dashboard
          </NavLink>
        </li>

        <li>
          <NavLink to="/ide">
            💻 Cloud IDE
          </NavLink>
        </li>

        <li>
          <NavLink to="/courses">
            📚 Courses
          </NavLink>
        </li>

        <li>
          <NavLink to="/community">
            🌐 Community
          </NavLink>
        </li>

        <li>
          <NavLink to="/marketplace">
            🛒 Marketplace
          </NavLink>
        </li>

        <li>
          <NavLink to="/hosting">
            ☁ Hosting
          </NavLink>
        </li>

        <li>
          <NavLink to="/freelance">
            💼 Freelance
          </NavLink>
        </li>

        <li>
          <NavLink to="/analytics">
            📊 Analytics
          </NavLink>
        </li>

        <li>
          <NavLink to="/settings">
            ⚙ Settings
          </NavLink>
        </li>

      </ul>

    </nav>

  </aside>

  {/* MAIN */}

  <main className="main">

    {/* TOPBAR */}

    <header className="topbar">

      <div className="topbar-left">

        <input
          type="text"
          placeholder="Search projects..."
          className="search"
        />

      </div>

      <div className="topbar-right">

        <button className="icon-btn">
          🔔
        </button>

        <button className="icon-btn">
          🤖
        </button>

        <div className="profile">

          <img
            src="https://i.pravatar.cc/40"
            alt="profile"
          />

          <span>Ahmed</span>

        </div>

      </div>

    </header>

    {/* ROUTES */}

    <Routes>

      <Route
        path="/"
        element={<Dashboard />}
      />

      <Route
        path="/ide"
        element={<IDE />}
      />

      <Route
        path="/courses"
        element={<Courses />}
      />

      <Route
        path="/community"
        element={<Community />}
      />

      <Route
        path="/marketplace"
        element={<Marketplace />}
      />

      <Route
        path="/hosting"
        element={<Hosting />}
      />

      <Route
        path="/freelance"
        element={<Freelance />}
      />

      <Route
        path="/analytics"
        element={<Analytics />}
      />

      <Route
        path="/settings"
        element={<Settings />}
      />

    </Routes>

  </main>

</div>

);

}

export default App;
