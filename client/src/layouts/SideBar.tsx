import { Link, useLocation } from "react-router";

const SideBar = () => {
  const curloaction = useLocation();
  return (
    <div className="flex flex-col">
      <h3 className="text-2xl m-3">SideBar</h3>
      {curloaction.pathname === "/" && <Link to="/add">Add</Link>}
      {curloaction.pathname === "/add" && <Link to="/">Home</Link>}
    </div>
  );
};

export default SideBar;
