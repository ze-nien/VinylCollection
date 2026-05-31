import { useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import { useWishListStore } from "../store/wishListStore";
import Spinner from "../components/ui/Spinner";
import WishListForm from "../components/forms/WishListForm";
import WishListCard from "../components/WishListCard";
import Pagination from "../components/Pagination";

const WishList = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoading = useWishListStore((s) => s.isLoading);
  const wishList = useWishListStore((s) => s.wishList);
  const fetchWishList = useWishListStore((s) => s.fetchWishList);
  const pagination = useWishListStore((s) => s.pagination);

  useEffect(() => {
    fetchWishList();
  }, [fetchWishList]);

  const handlePageChange = (newPage: number) => {
    fetchWishList(newPage);
    window.scrollTo(0, 0);
  };

  return (
    <div className="flex flex-col">
      {/* 新增 */}
      {isAuthenticated && <WishListForm />}
      {/* 現有 */}
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          <div className="flex flex-col items-center px-5 w-full gap-3 py-5">
            {wishList.length > 0 ? (
              wishList.map((d) => <WishListCard key={d._id} data={d} />)
            ) : (
              <h3 className="m-5 text-center">No data</h3>
            )}
          </div>
          {pagination && (
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.pages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  );
};

export default WishList;
