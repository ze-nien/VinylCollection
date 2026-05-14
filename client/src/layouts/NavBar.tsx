import { NavLink } from "react-router";

const NavBar = () => {
  const navItems = [
    { path: "/", label: "Vinyl Collection" },
    { path: "/stats", label: "Stats" },
    { path: "/wishlist", label: "Wish List" },
  ];
  const checkActive = ({ isActive }: { isActive: boolean }): string =>
    `font-semibold text-xl ${isActive ? "text-secondary" : "hover:text-secondary transition"} 
  `;

  return (
    <div className=" sticky top-0 z-50 h-16 bg-primary p-5 flex gap-3">
      {navItems.map((item) => (
        <NavLink key={item.path} to={item.path} className={checkActive}>
          {item.label}
        </NavLink>
      ))}
    </div>
  );
};

export default NavBar;
