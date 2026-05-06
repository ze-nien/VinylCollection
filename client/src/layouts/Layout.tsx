import NavBar from "./NavBar";
import Footer from "./Footer";
import { Outlet } from "react-router";
import SideBar from "./SideBar";

const Layout = () => {
  return (
    <div className="bg-secondary text-white flex flex-col min-h-svh">
      <NavBar />
      <main className="flex-1 flex flex-row items-top p-2">
        <SideBar />
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
