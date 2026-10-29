import { Navigate, Outlet, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
  redirectPath?: string;
}

export default function ProtectedRouter({
  redirectPath = "/admin",
}: ProtectedRouteProps) {
  const token = localStorage.getItem("adminToken");
  const location = useLocation();

  if (!token) {
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  return <Outlet />;
}
