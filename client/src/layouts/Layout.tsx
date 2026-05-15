import NavBar from "./NavBar";
import Footer from "./Footer";
import { Outlet } from "react-router";
import SideBar from "./SideBar";

const Layout = () => {
  return (
    <div className="bg-secondary text-white flex flex-col min-h-full">
      <NavBar />
      <main className="flex-1 flex flex-col md:flex-row items-stretch md:items-start">
        <SideBar />
        <div className="flex-1 pt-5 md:border-l-2 md:border-primary">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
