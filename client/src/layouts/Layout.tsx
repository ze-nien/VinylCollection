import NavBar from "./NavBar";
import Footer from "./Footer";
import { Outlet, useNavigate } from "react-router";
import SideBar from "./SideBar";
import { useUIStore } from "../store/uiStore";
import Modal from "../components/Modal";
import { useAuthStore } from "../store/authStore";
import { useEffect } from "react";

const Layout = () => {
  const navigate = useNavigate();

  const isChecking = useAuthStore((s) => s.isChecking);
  const checkAuth = useAuthStore((s) => s.checkAuth);
  const authError = useAuthStore((s) => s.authError);

  const isModalOpen = useUIStore((s) => s.isModalOpen);
  const closeModal = useUIStore((s) => s.closeModal);

  //檢查身分判斷介面呈現哪些資料
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (authError === "INVALID_DEVICE") {
      navigate("/auth/login", {
        state: { authErrorType: "INVALID_DEVICE" },
        replace: true,
      });
    }
  }, [authError, navigate]);

  if (isChecking) {
    return <div>初始化...</div>;
  }

  return (
    <div className="bg-secondary text-white flex flex-col min-h-full">
      <NavBar />
      <main className="flex-1 flex flex-col md:flex-row items-stretch md:items-start">
        <SideBar />
        <div className="flex-1 pt-5 pb-5 md:border-l-2 md:border-primary">
          <Outlet />
        </div>
        <Modal
          isOpen={isModalOpen}
          title="登入過期"
          confirmText="重新登入"
          onConfirm={() => {
            closeModal();
            navigate("/auth/login");
          }}
          onClose={closeModal}
        >
          <p>請重新登入以繼續管理黑膠唱片收藏。</p>
        </Modal>
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
