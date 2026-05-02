import { createBrowserRouter } from "react-router";
import Layout from "./layouts/Layout";
import Vinyl from "./pages/Vinyl";
import Stats from "./pages/Stats";
import WishList from "./pages/WishList";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Vinyl />,
      },
      {
        path: "stats",
        element: <Stats />,
      },
      {
        path: "wishlist",
        element: <WishList />,
      },
    ],
  },
]);
