import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../store/auth-context.js";

export default function RequireAdmin() {
  const { isAdmin } = useAuth();
  const location = useLocation();

  if (!isAdmin) {
    const from = `${location.pathname}${location.search}`;
    return <Navigate to="/login" replace state={{ from }} />;
  }

  return <Outlet />;
}
