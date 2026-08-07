import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { can } from "../../security/AccessControl";

export default function RoleRoute({
  permission,
  children,
}) {

  const { profile } = useAuth();

  if (!can(profile, permission)) {
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }

  return children;
}
