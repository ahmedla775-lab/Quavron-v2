import {

HashRouter,

Routes,

Route,

Link

} from "react-router-dom";

/* PAGES */

import Dashboard from "./pages/Dashboard";

import IDE from "./pages/IDE";

import Courses from "./pages/Courses";

import Community from "./pages/Community";

import Marketplace from "./pages/Marketplace";

import Hosting from "./pages/Hosting";

import Freelance from "./pages/Freelance";

import Settings from "./pages/Settings";

function App() {

return (

<HashRouter>

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

            <Link to="/">

              🏠 Dashboard

            </Link>

          </li>

          <li>

            <Link to="/ide">

              💻 Cloud IDE

            </Link>

          </li>

          <li>

            <Link to="/courses">

              📚 Courses

            </Link>

          </li>

          <li>

            <Link to="/community">

              🌐 Community

            </Link>

          </li>

          <li>

            <Link to="/marketplace">

              🛒 Marketplace

            </Link>

          </li>

          <li>

            <Link to="/hosting">

              ☁ Hosting

            </Link>

          </li>

          <li>

            <Link to="/freelance">

              💼 Freelance

            </Link>

          </li>

          <li>

            <Link to="/settings">

              ⚙ Settings

            </Link>

          </li>

        </ul>

      </nav>

    </aside>

    {/* MAIN */}

    <main className="main">

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

          path="/settings"

          element={<Settings />}

        />

      </Routes>

    </main>

  </div>

</HashRouter>

);

}

export default App;
