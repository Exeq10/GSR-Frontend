import { Navigate, Outlet } from "react-router-dom";

// 🔐 Componente para proteger rutas
const ProtectedRoutes = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoutes;
