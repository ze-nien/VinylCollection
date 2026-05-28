import { useEffect } from "react";
import { useSearchParams } from "react-router";

import { useVinylStore } from "../store/vinylStore";
import { useWishListStore } from "../store/wishListStore";

import { getEraChartConfig } from "../utils/chart";
import { getGenreChartConfig } from "../utils/chart";

import Spinner from "../components/ui/Spinner";
import { StatCard } from "../components/StatsCard";
import { BaseChart } from "../components/charts/BaseChart";

const Stats = () => {
  const isVinylLoading = useVinylStore((s) => s.isLoading);
  const vinylStats = useVinylStore((s) => s.stats);
  const fetchVinylStats = useVinylStore((s) => s.fetchStats);

  const isWishListLoading = useWishListStore((s) => s.isLoading);
  const wishListStats = useWishListStore((s) => s.stats);
  const fetchWishListStats = useWishListStore((s) => s.fetchStats);

  const [searchParams] = useSearchParams();
  const currentType =
    (searchParams.get("type") as "vinyl" | "wishlist") || "vinyl";
  const isCurrentLoading =
    currentType === "wishlist" ? isWishListLoading : isVinylLoading;
  const currentData = currentType === "wishlist" ? wishListStats : vinylStats;

  const eraConfig = getEraChartConfig(
    [...(currentData?.eraDistribution || [])].reverse(),
  );
  const genreConfig = getGenreChartConfig(
    [...(currentData?.genreDistribution || [])].sort(
      (a, b) => b.count - a.count,
    ),
  );

  useEffect(() => {
    if (currentType === "wishlist") {
      fetchWishListStats("/wishList/stats");
    } else {
      fetchVinylStats("/vinyls/stats");
    }
  }, [currentType, fetchVinylStats, fetchWishListStats]);

  return (
    <div className="max-w-screen mx-auto py-5">
      {isCurrentLoading ? (
        <Spinner />
      ) : (
        <div className="px-6 max-w-6xl mx-auto space-y-8 min-h-screen">
          <div
            className={`grid grid-cols-1 md:${
              currentData?.genreDistribution &&
              currentData?.genreDistribution.length > 0
                ? "grid-cols-3"
                : "grid-cols-2"
            } gap-6`}
          >
            <StatCard
              title="Total Count"
              value={`${currentData?.total || 0}`}
            />
            {currentData?.genreDistribution &&
            currentData?.genreDistribution.length > 0 ? (
              <StatCard
                title="Primary Genres"
                value={currentData?.genreDistribution?.[0]?.genreName || "none"}
              />
            ) : null}
            <StatCard
              title="Dominant Decades"
              value={currentData?.eraDistribution?.slice(-1)[0]?.era || "none"}
            />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {currentType === "vinyl" && (
              <div className="lg:col-span-2 h-100 bg-primary p-3 rounded-2xl shadow-sm">
                <h4 className="text-secondary text-center font-bold text-lg">
                  Genre Distribution
                </h4>
                <BaseChart config={genreConfig} />
              </div>
            )}
            <div
              className={`h-100 bg-primary p-3 rounded-2xl shadow-sm ${currentType === "wishlist" ? "col-span-3" : ""}`}
            >
              <h4
                className={`text-secondary text-center font-bold text-lg mb-1`}
              >
                Decades Distribution
              </h4>
              <BaseChart config={eraConfig} />
            </div>
          </div>

          {/* 推薦列 待更新 */}
          {/* {(currentData as VinylStats)?.recommend?.map((group, index) => (
            <div key={index} className="genre-section">
              <h3>曲風：{group.genre}</h3>
              <ul>
                {group.albums.map((item, albumIndex) => (
                  <li key={albumIndex}>
                    <strong>{item.album}</strong> - {item.artist}
                  </li>
                ))}
              </ul>
            </div>
          ))} */}
        </div>
      )}
    </div>
  );
};

export default Stats;
