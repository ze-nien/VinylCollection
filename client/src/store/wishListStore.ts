import axios from "axios";
import api from "../api/axiosInstance";
import { create } from "zustand";
import type { WishList, WishListBase } from "../types/wishList";
import type { VinylBase } from "../types/vinyl";

//頁數定義
interface Pagination {
  total: number;
  page: number;
  pages: number;
  limit: number;
}

//回傳資料定義
interface FetchWishListResponse {
  data: WishList[];
  pagination: Pagination;
}

interface moveState {
  success: boolean;
  message: string | null;
  data: VinylBase;
}

interface WishListState {
  wishList: WishList[];
  pagination: Pagination | null;
  listData: WishList | null;
  error: string | null;
  isLoading: boolean;
  fetchWishList: (page?: number) => Promise<void>;
  fetchWishListData: (id: string) => Promise<void>; //取得特定
  addWishListData: (newData: WishListBase) => Promise<void>;
  moveToVinyl: (id: string) => Promise<void>;
  updateWishList: (id: string, updateData: WishListBase) => Promise<void>;
  deleteWishListData: (id: string) => Promise<void>;
  clearListData: () => void;
}

export const useWishListStore = create<WishListState>((set) => ({
  wishList: [],
  pagination: null,
  listData: null,
  error: null,
  isLoading: false,
  fetchWishList: async (page = 1) => {
    set({ isLoading: true });
    try {
      const res = await api.get<FetchWishListResponse>(
        `/wishList?page=${page}`,
      );
      if (res?.data)
        set({
          wishList: res.data.data,
          pagination: res.data.pagination,
          isLoading: false,
        });
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        const errorMessage =
          e.response?.data?.message || e.message || "發生未知錯誤";
        set({ wishList: [], isLoading: false, error: errorMessage });
      }
      throw e;
    }
  },
  fetchWishListData: async (id) => {
    set({ isLoading: true });
    try {
      const res = await api.get<WishList>(`/wishList/${id}`);
      set({ listData: res.data, isLoading: false });
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        const errorMessage =
          e.response?.data?.message || e.message || "發生未知錯誤";
        set({ listData: null, isLoading: false, error: errorMessage });
      }
      throw e;
    }
  },
  addWishListData: async (newData) => {
    set({ isLoading: true });
    try {
      const res = await api.post<WishList>("/wishList", newData);
      set((state) => ({
        wishList: [res.data, ...state.wishList],
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
  updateWishList: async (id, updateData) => {
    set({ isLoading: true });
    try {
      const res = await api.patch<WishList>(`/wishList/${id}`, updateData);
      set((state) => ({
        wishList: state.wishList.map((data) =>
          data._id === id ? { ...data, ...res.data } : data,
        ),
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
  moveToVinyl: async (id) => {
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
  clearListData: () => set({ listData: null, isLoading: false }),
}));
