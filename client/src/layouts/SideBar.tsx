import { Link, useLocation, useParams } from "react-router";
import { useVinylStore } from "../store/vinylStore";

import { GENRES } from "../../../shared/constants";
import { useState } from "react";

const SideBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const curloaction = useLocation();
  const vinyl = useVinylStore((s) => s.vinyl);
  const setLimit = useVinylStore((s) => s.setLimit);
  const filters = useVinylStore((s) => s.filters);
  const updateFilter = useVinylStore((s) => s.updateFilter);
  const fetchVinyls = useVinylStore((s) => s.fetchVinyls);
  const { id } = useParams();
  const isInvalidRoute = id && vinyl;

  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLimit(Number(e.target.value));
    fetchVinyls(1);
  };

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
      className="px-2 bg-primary text-secondary border-primary shadow-md pr-2
    md:w-44 md:border-r-2 md:bg-secondary md:text-primary"
    >
      <h3 className="text-xl">SideBar</h3>
      <Link to="/add" className="hover:text-white transition">
        <h3 className="text-xl">Add</h3>
      </Link>
      {/* sidebar內容展開收起 */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center cursor-pointer md:cursor-default md:bg-transparent rounded md:p-0"
      >
        <span className="text-sm  md:hidden">
          {isOpen ? "▲ 收起" : "▼ 展開"}
        </span>
      </div>
      {curloaction.pathname === "/" && (
        //展開動畫
        <div
          className={`
            ${isOpen ? "max-h-125 opacity-100 mt-2" : "max-h-0 opacity-0"}
            transition-all duration-500 ease-in-out overflow-hidden
            md:max-h-none md:opacity-100 md:block space-y-2
          `}
        >
          {/* 資料數 */}
          <section>
            <label htmlFor="pageLimit" className="">
              perPageData
            </label>
            <select
              name="pageLimit"
              id="pageLimit"
              className="bg-primary md:bg-secondary border-none focus:ring-0 text-xs m-1 py-1 pl-1"
              onChange={handleLimitChange}
              defaultValue={12}
            >
              <option value="12">12</option>
              <option value="24">24</option>
              <option value="36">36</option>
            </select>
          </section>
          {/* Artist */}
          <section>
            <h3 className="mb-1">Artist</h3>
            <div className="flex md:flex-col gap-2">
              {["createdAt", "asc", "desc"].map((type) => (
                <label
                  key={type}
                  htmlFor={`sort-${type}`}
                  className="flex items-center gap-2 cursor-pointer text-sm"
                >
                  <input
                    type="radio"
                    name="sort"
                    id={`sort-${type}`}
                    checked={filters.artistSort === type}
                    onChange={() => updateFilter({ artistSort: type })}
                    className="text-secondary focus:ring-0 focus:ring-offset-0 md:checked:text-primary"
                  />
                  <div className="hover:text-white transition">
                    {type === "createdAt"
                      ? "Latest"
                      : type === "asc"
                        ? "A - Z"
                        : "Z - A"}
                  </div>
                </label>
              ))}
            </div>
          </section>
          {/* Genre */}
          <section>
            <label htmlFor="">Genre</label>
            <div className="grid grid-cols-5 md:grid-cols-2 gap-1 pr-2">
              {GENRES.map((g) => {
                const isActive = filters.genre?.includes(g);
                return (
                  <button
                    key={g}
                    onClick={() => handleGenreClick(g)}
                    className={`text-xs py-0.5 rounded-md transition hover:cursor-pointer 
        ${
          isActive
            ? "bg-secondary text-primary md:bg-primary md:text-secondary" // 選中樣式
            : "hover:text-primary hover:bg-secondary md:hover:text-secondary md:hover:bg-primary" // 未選中樣式
        }`}
                  >
                    {g}
                  </button>
                );
              })}
            </div>
          </section>
          {/* Year */}
          <section>
            <h3 className="mb-1">Year</h3>
            <div className="flex md:grid md:grid-cols-3 gap-2">
              {["All", "80s", "90s", "00s", "10s", "20s"].map((type) => (
                <label
                  key={type}
                  htmlFor={`year-${type}`}
                  className="flex items-center gap-2 cursor-pointer text-sm"
                >
                  <input
                    type="radio"
                    name="year"
                    id={`year-${type}`}
                    disabled={filters.yearRange === type}
                    checked={filters.yearRange === type}
                    onChange={() => updateFilter({ yearRange: type })}
                    className="text-secondary focus:ring-0 focus:ring-offset-0 md:checked:text-primary"
                  />
                  <div className="hover:text-white transition">{type}</div>
                </label>
              ))}
            </div>
          </section>
          {/* Rating */}
          <section>
            <h3 className="mb-1">Rating</h3>
            <div className="flex md:flex-col gap-2">
              {["All", "3", "4", "5"].map((type) => (
                <label
                  key={type}
                  htmlFor={`rating-${type}`}
                  className="flex items-center gap-2 cursor-pointer text-sm"
                >
                  <input
                    type="radio"
                    name="rating"
                    id={`rating-${type}`}
                    disabled={filters.albumRating === type}
                    checked={filters.albumRating === type}
                    onChange={() => updateFilter({ albumRating: type })}
                    className="text-secondary focus:ring-0 focus:ring-offset-0 md:checked:text-primary"
                  />
                  <div className="hover:text-white transition">
                    {type === "All" ? "All" : `${type}+stars`}
                  </div>
                </label>
              ))}
            </div>
          </section>
        </div>
      )}

      {(curloaction.pathname === "/add" || isInvalidRoute) && (
        <Link to="/">Home</Link>
      )}
    </aside>
  );
};

export default SideBar;
