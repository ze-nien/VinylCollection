import { useState } from "react";
import { Link, useLocation, useParams } from "react-router";
import { GENRES } from "../../../shared/constants";
import { useVinylStore } from "../store/vinylStore";
import BaseSelect from "../components/ui/BaseSelect";
import BaseRadio from "../components/ui/BaseRadio";
import FilterButton from "../components/FilterButton";
import { useAuthStore } from "../store/authStore";

const SideBar = () => {
  //zustand
  const isAdmin = useAuthStore((s) => s.isAdmin);
  const vinyl = useVinylStore((s) => s.vinyl);
  const filters = useVinylStore((s) => s.filters);
  const updateFilter = useVinylStore((s) => s.updateFilter);
  //控制展開收起
  const [isOpen, setIsOpen] = useState(false);
  //Add Home出現時機判斷依據
  const curloaction = useLocation();
  const { id } = useParams();
  const isInvalidRoute = id && vinyl;
  //Genre篩選邏輯
  const handleGenreClick = (g: string) => {
    const currentGenres = filters.genre || [];
    // 已存在->移除 不存在->加入
    const nextGenres = currentGenres.includes(g)
      ? currentGenres.filter((item) => item !== g)
      : [...currentGenres, g];
    updateFilter({ genre: nextGenres });
  };

  return (
    <aside
      className="px-2 bg-primary text-secondary border-primary shadow-md
                   md:bg-secondary md:text-primary md:w-44"
    >
      {isAdmin && curloaction.pathname === "/" && (
        <Link to="/add" className="hover:text-white transition">
          <h3 className="text-2xl md:mt-2 text-center">Add</h3>
        </Link>
      )}
      {(curloaction.pathname === "/add" ||
        curloaction.pathname === "/auth/login" ||
        isInvalidRoute) && (
        <Link to="/" className="hover:text-white transition">
          <h3 className="text-2xl md:mt-2">Home</h3>
        </Link>
      )}

      {/* sidebar內容展開收起 */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center cursor-pointer md:cursor-default md:bg-transparent rounded md:p-0"
      >
        <span className="mt-1 text-sm  md:hidden">
          {isOpen ? "▲ 收起" : "▼ 展開"}
        </span>
      </div>
      {curloaction.pathname === "/" && (
        //展開動畫
        <div
          className={`
            ${isOpen ? "max-h-125 opacity-100" : "max-h-0 opacity-0"}
            transition-all duration-500 ease-in-out overflow-hidden
            md:max-h-none md:opacity-100 md:block space-y-2
          `}
        >
          {/* 資料數 */}
          <BaseSelect
            label="-perPageData-"
            name="pageLimit"
            value={filters.limit}
            options={[
              { label: "12", value: 12 },
              { label: "24", value: 24 },
              { label: "36", value: 36 },
            ]}
            onChange={(val) => updateFilter({ limit: Number(val) })}
          />
          {/* Artist */}
          <section>
            <h3>-Sort-</h3>
            <BaseRadio
              name="sort"
              value={filters.artistSort}
              options={[
                { label: "Latest", value: "createdAt" },
                { label: "Artist A-Z", value: "asc" },
                { label: "Artist Z-A", value: "desc" },
              ]}
              onChange={(value) => updateFilter({ artistSort: value })}
              className="flex md:flex-col gap-2"
            />
          </section>
          {/* Genre */}
          <section>
            <label htmlFor="genre">-Genre-</label>
            <FilterButton
              options={GENRES}
              activeValue={filters.genre}
              onClick={handleGenreClick}
              className="grid grid-cols-5 md:grid-cols-2 gap-1 pr-2"
            />
          </section>
          {/* Year */}
          <section>
            <h3>-Year-</h3>
            <BaseRadio
              name="year"
              value={filters.yearRange}
              options={[
                { label: "All", value: "All" },
                { label: "80s", value: "80s" },
                { label: "90s", value: "90s" },
                { label: "00s", value: "00s" },
                { label: "10s", value: "10s" },
                { label: "20s", value: "20s" },
              ]}
              onChange={(value) => updateFilter({ yearRange: value })}
              className="flex md:grid md:grid-cols-3 gap-2"
            />
          </section>
          {/* Rating */}
          <section>
            <h3>-Rating-</h3>
            <BaseRadio
              name="albumRating"
              value={filters.albumRating}
              options={[
                { label: "All", value: "All" },
                { label: "3+stars", value: "3" },
                { label: "4+stars", value: "4" },
                { label: "5 stars", value: "5" },
              ]}
              onChange={(value) => updateFilter({ albumRating: value })}
              className="flex md:flex-col gap-2"
            />
          </section>
        </div>
      )}
    </aside>
  );
};

export default SideBar;
