import { LiveProvider } from "./modules/live/context/LiveContext";


import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import {
  lazy,
  Suspense,
} from "react";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";



import Projects from "./pages/Projects";

import Courses from "./pages/Courses";

import Hosting from "./pages/Hosting";


import Profile from "./pages/Profile";
import UserProfile from "./pages/UserProfile";
import Settings from "./pages/Settings";
import UserSettings from "./pages/UserSettings";
import PostDetails from "./pages/PostDetails";

import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";
import VerificationManagement from "./pages/admin/VerificationManagement";
import ReportsManagement from "./pages/admin/ReportsManagement";
import AdsManagement from "./pages/admin/AdsManagement";
import SystemSettings from "./pages/admin/SystemSettings";

import Layout from "./components/layout/Layout";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AdminRoute from "./components/admin/AdminRoute";

const QCCDashboard = lazy(() => import("./modules/qcc/pages/QCCDashboard"));
const LiveRoom = lazy(() => import("./modules/live/pages/LiveRoom"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const IDE = lazy(() => import("./pages/IDE"));
const AI = lazy(() => import("./pages/AI"));
const Marketplace = lazy(() => import("./pages/Marketplace"));
const Community = lazy(() => import("./pages/Community"));
const Analytics = lazy(() => import("./pages/Analytics"));


function App() {

  return (

    <BrowserRouter>

      <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>

      <Routes>

        <Route
          path="/"
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/projects"
          element={
            <ProtectedRoute>
              <Projects />
            </ProtectedRoute>
          }
        />

        <Route
          path="/ide"
          element={
            <ProtectedRoute>
              <IDE />
            </ProtectedRoute>
          }
        />

        <Route
          path="/ai"
          element={
            <ProtectedRoute>
              <AI />
            </ProtectedRoute>
          }
        />

        <Route
          path="/courses"
          element={
            <ProtectedRoute>
              <Courses />
            </ProtectedRoute>
          }
        />

        <Route
          path="/marketplace"
          element={
            <ProtectedRoute>
              <Marketplace />
            </ProtectedRoute>
          }
        />

        <Route
          path="/hosting"
          element={
            <ProtectedRoute>
              <Hosting />
            </ProtectedRoute>
          }
        />

        <Route
          path="/community"
          element={
            <ProtectedRoute>
              <Community />
            </ProtectedRoute>
          }
        />

<Route
  path="/community/live"
  element={
    <ProtectedRoute>
      <LiveProvider>
        <LiveRoom />
      </LiveProvider>
    </ProtectedRoute>
  }
/>
        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <Analytics />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile/:id"
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/user-settings"
          element={
            <ProtectedRoute>
              <UserSettings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/post/:id"
          element={<PostDetails />}
        />

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <UserManagement />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/verifications"
          element={
            <AdminRoute>
              <VerificationManagement />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/reports"
          element={
            <AdminRoute>
              <ReportsManagement />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/ads"
          element={
            <AdminRoute>
              <AdsManagement />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/system"
          element={
            <AdminRoute>
              <SystemSettings />
            </AdminRoute>
          }
        />

<Route
  path="/qcc"
  element={
    <ProtectedRoute>
      <QCCDashboard />
    </ProtectedRoute>
  }
/>

        <Route
          path="*"
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />

      </Routes>

      </Suspense>

    </BrowserRouter>

  );

}

export default App;
