import { useEffect } from "react";
import VinylCard from "../components/VinylCard";
import { useVinylStore } from "../store/vinylStore";
import Spinner from "../components/ui/Spinner";
import Pagination from "../components/Pagination";

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
    <div className="max-w-screen mx-auto py-5">
      {isLoading ? (
        <Spinner />
      ) : vinyls.length > 0 ? (
        <div>
          <div
            className="grid grid-cols-1 
          md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 
          gap-8 justify-items-center  items-start"
          >
            {vinyls.map((vinyl) => (
              <VinylCard key={vinyl._id} vinyl={vinyl} />
            ))}
          </div>
          {pagination && (
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.pages}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      ) : (
        <h3 className="m-5 text-center">No data</h3>
      )}
    </div>
  );
};

export default Vinyl;
