import { useState } from "react";

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

  /* MOBILE MENU */

  const [mobileMenu, setMobileMenu] =
    useState(false);

  return (

    <div className="dashboard">

      {/* MOBILE BUTTON */}

      <button
        className="menu-toggle"
        onClick={() =>
          setMobileMenu(!mobileMenu)
        }
      >
        ☰
      </button>

      {/* OVERLAY */}

      {
        mobileMenu && (
          <div
            className="sidebar-overlay"
            onClick={() =>
              setMobileMenu(false)
            }
          />
        )
      }

      {/* SIDEBAR */}

      <aside
        className={
          mobileMenu
            ? "sidebar mobile-open"
            : "sidebar"
        }
      >

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
              <NavLink
                to="/"
                onClick={() =>
                  setMobileMenu(false)
                }
              >
                🏠 Dashboard
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/ide"
                onClick={() =>
                  setMobileMenu(false)
                }
              >
                💻 Cloud IDE
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/courses"
                onClick={() =>
                  setMobileMenu(false)
                }
              >
                📚 Courses
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/community"
                onClick={() =>
                  setMobileMenu(false)
                }
              >
                🌐 Community
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/marketplace"
                onClick={() =>
                  setMobileMenu(false)
                }
              >
                🛒 Marketplace
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/hosting"
                onClick={() =>
                  setMobileMenu(false)
                }
              >
                ☁ Hosting
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/freelance"
                onClick={() =>
                  setMobileMenu(false)
                }
              >
                💼 Freelance
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/analytics"
                onClick={() =>
                  setMobileMenu(false)
                }
              >
                📊 Analytics
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/settings"
                onClick={() =>
                  setMobileMenu(false)
                }
              >
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
