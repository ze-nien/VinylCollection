import NavBar from "./NavBar";
import Footer from "./Footer";
import { Outlet } from "react-router";
import SideBar from "./SideBar";

const Layout = () => {
  return (
    <>
      <NavBar />
      <div className="flex">
        <SideBar />
        <Outlet />
      </div>
      <Footer />
    </>
  );
};

export default Layout;
