import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

const RutaPrivada = ({ rolesPermitidos }) => {
  const { user } = useAuthStore();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!rolesPermitidos.includes(user.rol)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default RutaPrivada;
