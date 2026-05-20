import axios from "axios";
import api from "../api/axiosInstance";
import { create } from "zustand";
import type { WishList, WishListBase } from "../types/wishList";
import type { VinylBase } from "../types/vinyl";

interface moveState {
  success: boolean;
  message: string | null;
  data: VinylBase;
}

interface WishListState {
  wishList: WishList[];
  error: string | null;
  isLoading: boolean;
  fetchWishList: () => Promise<void>;
  addWishListData: (newData: WishListBase) => Promise<void>;
  updateWishList: (id: string) => Promise<void>;
  deleteWishListData: (id: string) => Promise<void>;
}

export const useWishListStore = create<WishListState>((set) => ({
  wishList: [],
  error: null,
  isLoading: false,
  fetchWishList: async () => {
    set({ isLoading: true });
    try {
      const res = await api.get<{ data: WishList[] }>(`/wishList`);
      if (res?.data) set({ wishList: res.data.data, isLoading: false });
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        const errorMessage =
          e.response?.data?.message || e.message || "發生未知錯誤";
        set({ wishList: [], isLoading: false, error: errorMessage });
      }
      throw e;
    }
  },
  addWishListData: async (newData) => {
    set({ isLoading: true });
    try {
      const res = await api.post<WishList>("/wishList", newData);
      const savedData: WishList = {
        ...newData,
        _id: res.data._id,
      };
      set((state) => ({
        wishList: [savedData, ...state.wishList],
        isLoading: false,
      }));
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        const errorMessage =
          e.response?.data?.message || e.message || "發生未知錯誤";
        set({ wishList: [], isLoading: false, error: errorMessage });
      }
      throw e;
    }
  },
  updateWishList: async (id) => {
    set({ isLoading: true });
    try {
      const res = await api.post<moveState>(`/wishList/acquire/${id}`);
      if (res?.data?.success) {
        set((state) => ({
          wishList: state.wishList.filter((item) => item._id !== id),
          isLoading: false,
        }));
      }
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        const errorMessage =
          e.response?.data?.message || e.message || "發生未知錯誤";
        set({ wishList: [], isLoading: false, error: errorMessage });
      }
      throw e;
    }
  },
  deleteWishListData: async (id) => {
    set({ isLoading: true });
    try {
      await api.delete<WishList>(`/wishList/${id}`);
      set((state) => ({
        wishList: state.wishList.filter((item) => item._id !== id),
        isLoading: false,
      }));
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        const errorMessage =
          e.response?.data?.message || e.message || "發生未知錯誤";
        set({ wishList: [], isLoading: false, error: errorMessage });
      }
      throw e;
    }
  },
}));
