import axios from "axios";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/authStore";

//建立axios實例
const api = axios.create({
  baseURL: "http://localhost:3000/api",
  timeout: 10000, //發送請求超過10秒視為請求失敗
  withCredentials: true, //允許跨域請求攜帶並寫入Cookie
});

//請求攔截器
api.interceptors.request.use(
  (config) => config,
  (error) => {
    return Promise.reject(error);
  },
);

//回應攔截器
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      const isCheckAuth = error.config?.url?.includes("auth/me");
      //自檢401錯誤
      if (status === 401 && isCheckAuth) return Promise.reject(error);
      if (status === 401) {
        if (data?.message === "帳號或密碼錯誤") {
          toast.error("帳號或密碼錯誤");
          return Promise.reject(error);
        }
        if (data?.message === "拒絕存取，請先登入") {
          toast.error("拒絕存取，請先登入");
          useAuthStore.getState().logout();
          return Promise.reject(error);
        }
      }
      if (status === 403) {
        if (data?.message === "憑證異常，拒絕存取") {
          toast.error("憑證異常，拒絕存取");
          useAuthStore.getState().logout();
          return Promise.reject(error);
        }
      }
    }
    return Promise.reject(error);
  },
);

export default api;
