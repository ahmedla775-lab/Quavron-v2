import { Navigate } from "react-router-dom";

import { useAuth } from "./AuthProvider";

export default function ProtectedRoute({
  children,
}) {

  const {
    session,
    loading,
  } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        Loading...
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

