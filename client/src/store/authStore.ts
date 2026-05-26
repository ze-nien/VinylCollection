import { create } from "zustand";
import api from "../api/axiosInstance";
import axios from "axios";
interface User {
  role: string;
  userName: string;
}

interface AuthState {
  isChecking: boolean;
  isAuthenticated: boolean;
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  checkAuth: () => void;
  authError: string | null;
}

export const useAuthStore = create<AuthState>((set) => ({
  isChecking: true,
  isAuthenticated: false,
  user: null,
  authError: null,
  login: (userData) => {
    set({ user: userData, isAuthenticated: true });
  },
  logout: async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("後端登出失敗", error);
    } finally {
      set({ user: null, isAuthenticated: false });
    }
  },
  checkAuth: async () => {
    set({ isChecking: true });
    try {
      const res = await api.get("auth/me");
      //代表訪客或是登入成功
      if (res.data.success) {
        set({
          isAuthenticated: res.data.user ? true : false,
          user: res.data.user,
        });
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (
          error.response?.status === 403 &&
          error.response?.data?.message === "憑證無效或設備不匹配"
        ) {
          set({
            isAuthenticated: false,
            user: null,
            authError: "INVALID_DEVICE",
          });
          return;
        }
      } else {
        // 這裡處理非 Axios 的一般 JS 錯誤（例如程式碼寫錯噴的 Error）
        console.error("非 API 錯誤:", error);
      }
      //代表過期
      set({ isAuthenticated: false, user: null });
    } finally {
      // 🎯 不論成功失敗，檢查皆結束，解鎖畫面
      set({ isChecking: false });
    }
  },
}));
