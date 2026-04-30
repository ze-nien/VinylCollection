import VinylCard from "../components/VinylCard";
import { useVinyl } from "../hooks/useVinyl";

const Vinyl = () => {
  const { vinyls } = useVinyl();
  return (
    <div>
      {vinyls.length > 0 &&
        vinyls.map((vinyl) => <VinylCard key={vinyl._id} vinyl={vinyl} />)}
    </div>
  );
};

export default Vinyl;
