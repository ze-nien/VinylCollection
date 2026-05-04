import { createBrowserRouter } from "react-router";
import Layout from "./layouts/Layout";
import Vinyl from "./pages/Vinyl";
import Stats from "./pages/Stats";
import WishList from "./pages/WishList";
import VinylForm from "./components/VinylForm";

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
      {
        path: "add",
        element: <VinylForm />,
      },
      {
        path: "edit/:id",
        element: <VinylForm />,
      },
    ],
  },
]);
