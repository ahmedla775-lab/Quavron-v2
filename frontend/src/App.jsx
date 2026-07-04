import {
  BrowserRouter,
  Routes,
  Route,
  NavLink
} from "react-router-dom";

import {
  Home,
  Code,
  User,
  Settings,
  LogOut
} from "lucide-react";

import Login from "./pages/Login";
import Register from "./pages/Register";
import IDE from "./pages/IDE";
import Dashboard from "./pages/Dashboard";

function Layout({ children }) {

  return (

    <div
      style={{
        display:"flex",
        minHeight:"100vh",
        background:"#0f172a",
        color:"white"
      }}
    >

      {/* SIDEBAR */}

      <aside
        style={{
          width:"260px",
          background:"#111827",
          borderRight:"1px solid #1f2937",
          padding:"20px",
          display:"flex",
          flexDirection:"column",
          gap:"15px"
        }}
      >

        <h2>
          Quavron 🚀
        </h2>

        <NavLink
          to="/dashboard"
          style={linkStyle}
        >
          <Home size={18} />
          Dashboard
        </NavLink>

        <NavLink
          to="/ide"
          style={linkStyle}
        >
          <Code size={18} />
          IDE
        </NavLink>

        <NavLink
          to="/profile"
          style={linkStyle}
        >
          <User size={18} />
          Profile
        </NavLink>

        <NavLink
          to="/settings"
          style={linkStyle}
        >
          <Settings size={18} />
          Settings
        </NavLink>

        <button
          style={{
            marginTop:"auto",
            padding:"12px",
            background:"#dc2626",
            border:"none",
            color:"white",
            cursor:"pointer",
            borderRadius:"8px",
            display:"flex",
            alignItems:"center",
            gap:"10px"
          }}
        >

          <LogOut size={18} />

          Logout

        </button>

      </aside>

      {/* CONTENT */}

      <main
        style={{
          flex:1,
          padding:"30px"
        }}
      >

        {children}

      </main>

    </div>

  );

}

const linkStyle = {

  display:"flex",
  alignItems:"center",
  gap:"10px",
  padding:"12px",
  borderRadius:"8px",
  color:"white",
  textDecoration:"none",
  background:"#1f2937"

};

function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/dashboard"
          element={
            <Layout>
              <Dashboard />
            </Layout>
          }
        />

        <Route
          path="/ide"
          element={
            <Layout>
              <IDE />
            </Layout>
          }
        />

        <Route
          path="*"
          element={
            <Layout>
              <Dashboard />
            </Layout>
          }
        />

      </Routes>

    </BrowserRouter>

  );

}

export default App;0

