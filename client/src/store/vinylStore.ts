import axios from "axios";
import { create } from "zustand";
import type { Vinyl, VinylBase } from "../types/vinyl";

interface VinylState {
  vinyls: Vinyl[];
  vinyl: Vinyl | null;
  error: string | null;
  isLoading: boolean;
  fetchVinyls: () => Promise<void>;
  fetchVinyl: (id: string) => Promise<void>;
  addVinyl: (newVinyl: VinylBase) => Promise<void>;
  updateVinyl: (id: string, updatedVinyl: VinylBase) => Promise<void>;
  deleteVinyl: (id: string) => Promise<void>;
  clearVinyl: () => void;
}

export const useVinylStore = create<VinylState>((set) => ({
  vinyls: [],
  vinyl: null,
  error: null,
  isLoading: false,
  fetchVinyls: async () => {
    try {
      set({ isLoading: true });
      await new Promise((r) => setTimeout(r, 1000)); //模擬載入一秒
      const res = await axios.get<Vinyl[]>("http://localhost:3000/api/vinyls");
      if (res) set({ vinyls: res.data, isLoading: false });
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        const errorMessage =
          e.response?.data?.message || e.message || "發生未知錯誤";

        set({ vinyls: [], isLoading: false, error: errorMessage });
      }
    }
  },
  fetchVinyl: async (id) => {
    try {
      set({ isLoading: true });
      const res = await axios.get<Vinyl>(
        `http://localhost:3000/api/vinyls/${id}`,
      );
      set({ vinyl: res.data, isLoading: false });
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        const errorMessage =
          e.response?.data?.message || e.message || "發生未知錯誤";
        set({ vinyl: null, isLoading: false, error: errorMessage });
      }
    }
  },
  addVinyl: async (newVinyl) => {
    set({ isLoading: true });
    try {
      const res = await axios.post<Vinyl>(
        "http://localhost:3000/api/vinyls",
        newVinyl,
      );
      console.log(newVinyl);
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
    }
  },
  updateVinyl: async (id, updatedVinyl) => {
    set({ isLoading: true });
    try {
      const res = await axios.patch<Vinyl>(
        `http://localhost:3000/api/vinyls/${id}`,
        updatedVinyl,
      );
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
    }
  },
  deleteVinyl: async (id) => {
    try {
      await axios.delete<Vinyl>(`http://localhost:3000/api/vinyls/${id}`);
      set((state) => ({
        vinyls: state.vinyls.filter((vinyl) => vinyl._id !== id),
      }));
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        const errorMessage =
          e.response?.data?.message || e.message || "發生未知錯誤";
        set({ error: errorMessage });
      }
    }
  },
  clearVinyl: () => set({ vinyl: null, isLoading: false }),
}));
