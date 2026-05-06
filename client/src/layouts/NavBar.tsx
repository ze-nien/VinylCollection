import { NavLink } from "react-router";

const NavBar = () => {
  return (
    <div className="bg-primary p-5 flex gap-3 ">
      <NavLink to="/">Vinyl Collection</NavLink>
      <NavLink to="stats">Stats</NavLink>
      <NavLink to="/wishlist">Wish List</NavLink>
    </div>
  );
};

export default NavBar;
