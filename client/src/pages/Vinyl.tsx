import { useEffect } from "react";
import VinylCard from "../components/VinylCard";
import { useVinylStore } from "../store/vinylStore";
import Spinner from "../components/ui/Spinner";

const Vinyl = () => {
  const vinyls = useVinylStore((s) => s.vinyls);
  const fetchVinyls = useVinylStore((s) => s.fetchVinyls);
  const isLoading = useVinylStore((s) => s.isLoading);
  const pagination = useVinylStore((s) => s.pagination);
  useEffect(() => {
    fetchVinyls(1);
  }, [fetchVinyls]);

  const handlePageChange = (newPage: number) => {
    fetchVinyls(newPage);
    window.scrollTo(0, 0);
  };

  return (
    <div className="max-w-screen-xl mx-auto px-4 w-full">
      {/* [repeat(auto-fit,minmax(250px,1fr))] */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
        {isLoading && <Spinner />}
        {vinyls.map((vinyl) => (
          <VinylCard key={vinyl._id} vinyl={vinyl} />
        ))}
      </div>
      {pagination && (
        <div className="flex justify-center gap-4 mt-8">
          {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(
            (page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-4 py-2 rounded-md ${
                  pagination.page === page
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {page}
              </button>
            ),
          )}
        </div>
      )}
    </div>
  );
};

export default Vinyl;
