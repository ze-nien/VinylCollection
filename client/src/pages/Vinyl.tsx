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
    <div className="max-w-screen mx-auto">
      {isLoading ? (
        <Spinner />
      ) : vinyls.length > 0 ? (
        <div>
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-items-center">
            {vinyls.map((vinyl) => (
              <VinylCard key={vinyl._id} vinyl={vinyl} />
            ))}
          </div>
          {pagination && (
            <div className="flex justify-center items-center gap-4 mt-8">
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    disabled={pagination.page === page}
                    className={`px-3 py-2 rounded-md bg-transparent ${
                      pagination.page === page
                        ? "text-primary"
                        : "bg-gray-200 text-gray-500 hover:cursor-pointer hover:text-white transition"
                    }`}
                  >
                    {page}
                  </button>
                ),
              )}
            </div>
          )}
        </div>
      ) : (
        <h3 className="m-5 text-center">No data</h3>
      )}
    </div>
  );
};

export default Vinyl;
