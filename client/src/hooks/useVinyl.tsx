import { useState, useEffect } from "react";
import axios from "axios";
import type { Vinyl } from "../types/vinyl";

export const useVinyl = () => {
  const [vinyls, setVinyls] = useState<Vinyl[]>([]);

  useEffect(() => {
    const fetchAllVinyls = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/vinyls");
        if (res) setVinyls(res.data);
      } catch (e) {
        console.error(e);
      }
    };
    fetchAllVinyls();
  }, []);

  return { vinyls };
};
