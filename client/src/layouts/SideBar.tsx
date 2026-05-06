import { Link, useLocation, useParams } from "react-router";
import { useVinylStore } from "../store/vinylStore";

const SideBar = () => {
  const curloaction = useLocation();

  const vinyl = useVinylStore((s) => s.vinyl);
  const { id } = useParams();
  const isInvalidRoute = id && vinyl;

  return (
    <div className="flex flex-col border-r border-amber-300">
      <h3 className="text-2xl m-3">SideBar</h3>
      {curloaction.pathname === "/" && <Link to="/add">Add</Link>}
      {(curloaction.pathname === "/add" || isInvalidRoute) && (
        <Link to="/">Home</Link>
      )}
    </div>
  );
};

export default SideBar;
