import { Link, useLocation, useParams } from "react-router";
import { useVinylStore } from "../store/vinylStore";

import { GENRES } from "../../../shared/constants";

const SideBar = () => {
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

    // 如果已存在，則過濾掉（移除）；如果不存在，則加入陣列
    const nextGenres = currentGenres.includes(g)
      ? currentGenres.filter((item) => item !== g)
      : [...currentGenres, g];

    updateFilter({ genre: nextGenres });
  };

  return (
    <div className="text-primary border-r-2 border-primary">
      <h3 className="text-xl m-1">SideBar</h3>
      {curloaction.pathname === "/" && (
        <div className="flex flex-col gap-3">
          <Link to="/add" className="hover:text-white transition">
            Add
          </Link>
          {/* 資料數 */}
          <section>
            <label htmlFor="pageLimit" className="">
              perPageData
            </label>
            <select
              name="pageLimit"
              id="pageLimit"
              className="bg-secondary border-none focus:ring-0 text-xs m-1 py-1 pl-1"
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
            <h3 className="mb-1">Artist Sort</h3>
            <div className="flex flex-col gap-2">
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
                    className="text-primary focus:ring-0 focus:ring-offset-0"
                  />
                  {type === "createdAt"
                    ? "Latest"
                    : type === "asc"
                      ? "A - Z"
                      : "Z - A"}
                </label>
              ))}
            </div>
          </section>
          {/* Genre */}
          <section>
            <label htmlFor="">Genre</label>
            <div className="grid grid-cols-2 gap-1 pr-2">
              {GENRES.map((g) => {
                const isActive = filters.genre?.includes(g);
                return (
                  <button
                    key={g}
                    onClick={() => handleGenreClick(g)}
                    className={`text-xs py-0.5 rounded-md transition hover:cursor-pointer 
        ${
          isActive
            ? "bg-primary text-secondary border-primary" // 選中樣式
            : "hover:text-secondary hover:bg-primary border-gray-300" // 未選中樣式
        }`}
                  >
                    {g}
                  </button>
                );
              })}
            </div>
          </section>
          {/* Year */}
          <section></section>
          {/* Rating */}
          <section></section>
        </div>
      )}

      {(curloaction.pathname === "/add" || isInvalidRoute) && (
        <Link to="/">Home</Link>
      )}
    </div>
  );
};

export default SideBar;
