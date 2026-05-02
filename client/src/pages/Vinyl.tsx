import { useEffect } from "react";
import VinylCard from "../components/VinylCard";
import { useVinylStore } from "../store/vinylStore";
import Spinner from "../components/ui/Spinner";

const Vinyl = () => {
  const vinyls = useVinylStore((s) => s.vinyls);
  const fetchVinyls = useVinylStore((s) => s.fetchVinyls);
  const isLoading = useVinylStore((s) => s.isLoading);
  useEffect(() => {
    fetchVinyls();
  }, [fetchVinyls]);

  return (
    <div>
      {isLoading && <Spinner />}
      {vinyls.map((vinyl) => (
        <VinylCard key={vinyl._id} vinyl={vinyl} />
      ))}
    </div>
  );
};

export default Vinyl;
