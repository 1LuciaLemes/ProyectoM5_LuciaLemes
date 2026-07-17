import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/auth/useAuth";
import { LoadingState } from "../components/State/Loading.State";

type Props = {
    requiredRole?: "admin" | "customer";
};

export const ProtectedRoute = ({ requiredRole }: Props) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <LoadingState id="auth" loading={true} fallback={<p>Cargando...</p>} />;
    }

    if (!user) {
        return <Navigate to="/signin" state={{ from: location }} replace />;
    }

    if (requiredRole === "admin" && user.role !== "admin") {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};