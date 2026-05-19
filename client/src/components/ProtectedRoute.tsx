import { Navigate, Outlet } from "react-router";
import { useAuthStore } from "../store/authStore";

//isAuthenticated改變即觸發
const ProtectedRoute = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const logout = useAuthStore((s) => s.logout);

  //Token被清除 清除登入資料
  if (!isAuthenticated) {
    logout();
    //回到登入頁 replace防止點上一頁
    return (
      <Navigate
        to="/auth/login"
        state={{
          authErrorType: "TOKEN_DELETED",
          message: "登入憑證已失效，請重新登入",
        }}
        replace
      />
    );
  }
  //放行顯示Outlet
  return <Outlet />;
};

export default ProtectedRoute;
