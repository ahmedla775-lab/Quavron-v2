import { Navigate } from "react-router-dom";

import { useAuth } from "../auth/AuthProvider";

export default function AdminRoute({

  children,

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

  const role =
    profile?.role || "user";

  const allowed = [

    "owner",

    "admin",

  ];

  if (!allowed.includes(role)) {

    return <Navigate to="/dashboard" replace />;

  }

  return children;

}
