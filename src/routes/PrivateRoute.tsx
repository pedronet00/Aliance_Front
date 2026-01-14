import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";


export default function PrivateRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="text-center mt-10">Carregando...</div>; // ou spinner
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}
