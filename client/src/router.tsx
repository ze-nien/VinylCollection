import { createBrowserRouter } from "react-router";
import Layout from "./layouts/Layout";
import Vinyl from "./pages/Vinyl";
import Stats from "./pages/Stats";
import WishList from "./pages/WishList";
import VinylForm from "./components/forms/VinylForm";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";

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
        path: "auth/login",
        element: <Login />,
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "add",
            element: <VinylForm />,
          },
          {
            path: "edit/:id",
            element: <VinylForm />,
          },
          {
            path: "wishlist",
            element: <WishList />,
          },
        ],
      },
      {
        path: "stats",
        element: <Stats />,
      },
    ],
  },
]);
