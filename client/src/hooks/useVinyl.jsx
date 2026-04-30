import { useState, useEffect, useCallback } from "react";
import axios from "axios";

export const useVinyl = () => {
  const [vinyls, setVinyls] = useState([]);

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
