import { NavLink } from "react-router";
import { useAuthStore } from "../store/authStore";

const NavBar = () => {
  //login
  const isAdmin = useAuthStore((s) => s.isAdmin);
  const logout = useAuthStore((s) => s.logout);

  const navItems = [
    { path: "/", label: "Vinyl Collection", visible: true },
    { path: "/stats", label: "Stats", visible: true },
    { path: "/wishlist", label: "Wish List", visible: isAdmin },
    { path: "/auth/login", label: "Login", visible: !isAdmin },
  ];

  const visibleNavItems = navItems.filter((item) => item.visible);

  const checkActive = ({ isActive }: { isActive: boolean }): string =>
    `font-semibold text-xl ${isActive ? "text-secondary" : "hover:text-secondary transition"} 
  `;

  return (
    <div className="sticky top-0 z-50 h-16 bg-primary p-4 flex justify-between items-center">
      <div className="flex gap-3">
        {visibleNavItems.map((item) => {
          if (item.path === "/auth/login") return null;
          return (
            <NavLink key={item.path} to={item.path} className={checkActive}>
              {item.label}
            </NavLink>
          );
        })}
      </div>
      <div className="flex items-center">
        {isAdmin ? (
          <button
            onClick={logout}
            className="font-semibold text-xl hover:text-secondary transition cursor-pointer"
          >
            Logout
          </button>
        ) : (
          <NavLink to="auth/login" className={checkActive}>
            Login
          </NavLink>
        )}{" "}
      </div>
    </div>
  );
};

export default NavBar;
