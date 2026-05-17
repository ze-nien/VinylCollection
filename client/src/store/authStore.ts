import { create } from "zustand";

interface AuthState {
  token: string | null;
  isAdmin: boolean;
  login: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  // 初始值先撈localStorage，防止重新整理登入狀態消失
  token: localStorage.getItem("adminToken"),
  // 第一!轉成布林型態並反轉結果 第二!校正狀態
  isAdmin: !!localStorage.getItem("adminToken"),

  login: (token) => {
    localStorage.setItem("adminToken", token);
    set({ token, isAdmin: true });
  },

  logout: () => {
    localStorage.removeItem("adminToken");
    set({ token: null, isAdmin: false });
  },
}));
