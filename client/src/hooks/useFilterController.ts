import { useLocation } from "react-router";
import { useVinylStore } from "../store/vinylStore";
import { useWishListStore } from "../store/wishListStore";

const useFilterController = () => {
  const { pathname } = useLocation();
  const isWishlist = pathname.includes("wishlist");

  // 分別使用對應的 Store
  const vinylFilters = useVinylStore((s) => s.filters);
  const updateVinyl = useVinylStore((s) => s.updateFilter);

  const wishlistFilters = useWishListStore((s) => s.filters);
  const updateWishlist = useWishListStore((s) => s.updateFilter);

  return {
    filters: isWishlist ? wishlistFilters : vinylFilters,
    updateFilter: isWishlist ? updateWishlist : updateVinyl,
  };
};

export default useFilterController;
