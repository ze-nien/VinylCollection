import { NavLink } from "react-router";
import { VinylDisc } from "../components/ui/VinylDisc";

const NavBar = () => {
  return (
    <div className="bg-amber-400 p-5 flex gap-3 mb-2 ">
      <VinylDisc spinning={true} />
      <NavLink to="/">Home</NavLink>
      <NavLink to="stats">Stats</NavLink>
      <NavLink to="/wishlist">Wish List</NavLink>
    </div>
  );
};

export default NavBar;
