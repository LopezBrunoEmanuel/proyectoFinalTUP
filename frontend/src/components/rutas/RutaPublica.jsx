import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";

const RutaPublica = ({ children }) => {
    const { user, token } = useAuthStore();

    const isAuth = !!token && !!user;

    if (isAuth) return <Navigate to="/" replace />;

    return children;
}

export default RutaPublica