import axios from "axios";
import api from "../api/axiosInstance";
import { create } from "zustand";
import type { Vinyl, VinylBase } from "../types/vinyl";

//頁數定義
interface Pagination {
  total: number;
  page: number;
  pages: number;
  limit: number;
}

//回傳資料定義
interface FetchVinylsResponse {
  data: Vinyl[];
  pagination: Pagination;
}

//篩選定義
interface Filter {
  limit: number;
  artistSort: string; // createdAt | asc | desc
  genre: string[];
  yearRange: string; // ~80s | 90s | 00s | 10s | 20s
  albumRating: string; // 3,4,5 | All
}
//篩選初始值
const initialFilters: Filter = {
  limit: 12, //預設每頁12筆
  artistSort: "createdAt", // 預設排序：最新
  genre: [], // 預設不限曲風
  yearRange: "All", // 預設不限年代
  albumRating: "All", // 預設不限評分
};

interface VinylState {
  vinyls: Vinyl[]; //多個資料
  pagination: Pagination | null; //頁數定義在VinylState內與後端接收資料時一起更新
  vinyl: Vinyl | null; //單一資料
  error: string | null; //錯誤訊息
  isLoading: boolean; //讀取狀態
  filters: Filter; //篩選
  updateFilter: (newFilters: Partial<Filter>) => void; //更新局部篩選
  fetchVinyls: (page?: number, limit?: number) => Promise<void>; //取得所有
  fetchVinyl: (id: string) => Promise<void>; //取得特定
  addVinyl: (newVinyl: VinylBase) => Promise<void>; //新增
  updateVinyl: (id: string, updatedVinyl: VinylBase) => Promise<void>; //更新
  deleteVinyl: (id: string) => Promise<void>; //刪除
  clearVinyl: () => void; //清除
}

export const useVinylStore = create<VinylState>((set, get) => ({
  vinyls: [],
  pagination: null,
  vinyl: null,
  error: null,
  isLoading: false,
  filters: initialFilters,
  updateFilter: (newFilter) => {
    set((s) => {
      const updatedFilters = { ...s.filters, ...newFilter };
      // 如果有pagination資料->page重置為1
      const updatedPagination = s.pagination
        ? { ...s.pagination, page: 1 }
        : null;

      return {
        filters: updatedFilters,
        pagination: updatedPagination,
      };
    });
    get().fetchVinyls(1);
  },
  fetchVinyls: async (page = 1) => {
    set({ isLoading: true });
    try {
      const { filters } = get();
      const params = new URLSearchParams({
        page: page.toString(),
        limit: filters.limit.toString(),
        sort: filters.artistSort,
        genre: filters.genre.join(","),
        yearRange: filters.yearRange,
        minAlbumRating: filters.albumRating?.toString() || "",
      });
      // await new Promise((r) => setTimeout(r, 1000)); //模擬載入一秒
      const res = await api.get<FetchVinylsResponse>(`/vinyls?${params}`);
      if (res?.data)
        set({
          vinyls: res.data.data,
          pagination: res.data.pagination,
          isLoading: false,
        });
    } catch (e: unknown) {
      let errorMessage = "發生未知錯誤";
      if (axios.isAxiosError(e)) {
        //後端寫好的message->Axios錯誤訊息
        errorMessage = e.response?.data?.message || e.message || "讀取黑膠失敗";
      } else if (e instanceof Error) {
        //一般JS錯誤
        errorMessage = e.message;
      }
      set({
        vinyls: [], // 發生錯誤時清空列表，或保留舊資料，視你的 UI 設計而定
        isLoading: false,
        error: errorMessage,
      });
      throw e;
    }
  },
  fetchVinyl: async (id) => {
    set({ isLoading: true });
    try {
      const res = await api.get<Vinyl>(`/vinyls/${id}`);
      set({ vinyl: res.data, isLoading: false });
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        const errorMessage =
          e.response?.data?.message || e.message || "發生未知錯誤";
        set({ vinyl: null, isLoading: false, error: errorMessage });
      }
      throw e;
    }
  },
  addVinyl: async (newVinyl) => {
    set({ isLoading: true });
    try {
      const res = await api.post<Vinyl>(`/vinyls`, newVinyl);
      const savedVinyl: Vinyl = {
        ...newVinyl,
        _id: res.data._id,
      };
      set((state) => ({
        vinyls: [savedVinyl, ...state.vinyls],
        isLoading: false,
      }));
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        const errorMessage =
          e.response?.data?.message || e.message || "發生未知錯誤";
        set({ isLoading: false, error: errorMessage });
      }
      throw e;
    }
  },
  updateVinyl: async (id, updatedVinyl) => {
    set({ isLoading: true });
    try {
      const res = await api.patch<Vinyl>(`/vinyls/${id}`, updatedVinyl);
      set((state) => ({
        vinyls: state.vinyls.map((vinyl) =>
          vinyl._id === id ? { ...vinyl, ...res.data } : vinyl,
        ),
        isLoading: false,
      }));
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        const errorMessage =
          e.response?.data?.message || e.message || "發生未知錯誤";
        set({ isLoading: false, error: errorMessage });
      }
      throw e;
    }
  },
  deleteVinyl: async (id) => {
    set({ isLoading: true });
    try {
      await api.delete<Vinyl>(`/vinyls/${id}`);
      set((state) => ({
        vinyls: state.vinyls.filter((vinyl) => vinyl._id !== id),
        isLoading: false,
      }));
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        const errorMessage =
          e.response?.data?.message || e.message || "發生未知錯誤";
        set({ isLoading: false, error: errorMessage });
      }
      throw e;
    }
  },
  clearVinyl: () => set({ vinyl: null, isLoading: false }),
}));
