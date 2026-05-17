import axios from "axios";
import { useAuthStore } from "../store/authStore";

// 建立統一axios實例
const api = axios.create({
  baseURL: "http://localhost:3000/api",
  timeout: 10000, //發送請求超過10秒視為請求失敗
});

// 請求攔截器：每次新增、編輯、刪除時發送API時 先檢查有沒有Token
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    //判斷token與HTTP請求標頭存在 才在標頭加上token回傳
    if (token && config.headers) {
      //驗證的種類: 持票人驗證 Bearer [JWT Token]
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// 回應攔截器
api.interceptors.response.use(
  (response) => response, //成功回應(2xx)：直接回傳完整response
  (error) => {
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
      //Token過期或無效（401/403）
    ) {
      useAuthStore.getState().logout(); // 清除Token
    }
    return Promise.reject(error);
  },
);

export default api;
