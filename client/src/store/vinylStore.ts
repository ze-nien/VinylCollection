import axios from "axios";
import { create } from "zustand";
import type { Vinyl } from "../types/vinyl";

interface VinylState {
  vinyls: Vinyl[];
  isLoading: boolean;
  fetchVinyls: () => Promise<void>;
  addVinyl: (newVinyl: Omit<Vinyl, "_id">) => Promise<void>;
}

export const useVinylStore = create<VinylState>((set) => ({
  vinyls: [],
  isLoading: false,
  fetchVinyls: async () => {
    try {
      set({ isLoading: true });
      await new Promise((r) => setTimeout(r, 1000)); //模擬載入一秒
      const res = await axios.get("http://localhost:3000/api/vinyls");
      if (res) set({ vinyls: res.data, isLoading: false });
    } catch (e) {
      console.error(e);
    }
  },
  addVinyl: async (newVinyl) => {
    console.log(newVinyl);
    set({ isLoading: true });
    try {
      const res = await axios.post<Vinyl>(
        "http://localhost:3000/api/vinyls",
        newVinyl,
      );
      const savedVinyl: Vinyl = {
        ...newVinyl,
        _id: res.data._id,
      };
      set((state) => ({
        vinyls: [savedVinyl, ...state.vinyls],
        isLoading: false,
      }));
    } catch (e) {
      console.error(e);
    }
  },
}));
