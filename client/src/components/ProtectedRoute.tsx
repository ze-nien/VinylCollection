import { Navigate, Outlet } from "react-router";
import { useAuthStore } from "../store/authStore";

const ProtectedRoute = () => {
  const token = useAuthStore((s) => s.token);
  if (!token) {
    //replace防止點上一頁
    return <Navigate to="/auth/login" replace />;
  }
  return <Outlet />;
};

export default ProtectedRoute;
