// RoleRoute.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface RoleRouteProps {
  roles: string[];
}

export default function RoleRoute({ roles }: RoleRouteProps) {
  const { user } = useAuth();

  const userRoles = Array.isArray(user?.role) ? user.role : [user?.role];

  const allowed = userRoles.some((r: string) => roles.includes(r));

  if (!allowed) {
    return <Navigate to="/403" replace />; // ou para Home
  }

  return <Outlet />;
}
