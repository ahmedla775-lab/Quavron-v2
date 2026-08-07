import { Navigate } from "react-router-dom";

import { useAuth } from "../auth/AuthProvider";
import { can } from "../../security/AccessControl";

export default function AdminRoute({
  children,
  permission = null,
}) {
  const {
    loading,
    user,
    profile,
  } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const role = profile?.role || "user";

  const isAdmin =
    role === "owner" ||
    role === "admin";

  const hasRequestedPermission =
    permission &&
    can(profile, permission);

  if (!isAdmin && !hasRequestedPermission) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
