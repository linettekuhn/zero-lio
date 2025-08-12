import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import "./index.css";
import App from "./App.tsx";
import Home from "./pages/Home.tsx";
import RequireAuth from "./RequireAuth.tsx";
import Reserve from "./pages/Reserve.tsx";
import Reservations from "./pages/Reservations.tsx";
import Community from "./pages/Community.tsx";
import Settings from "./pages/Settings.tsx";
import MakeReview from "./pages/MakeReview.tsx";

const router = createBrowserRouter(
  [
    { path: "/", element: <App /> },
    {
      path: "/canchas",
      element: (
        <RequireAuth>
          <Home />
        </RequireAuth>
      ),
    },
    {
      path: "/reservar",
      element: (
        <RequireAuth>
          <Reserve />
        </RequireAuth>
      ),
    },
    {
      path: "/reservaciones",
      element: (
        <RequireAuth>
          <Reservations />
        </RequireAuth>
      ),
    },
    {
      path: "/comunidad",
      element: (
        <RequireAuth>
          <Community />
        </RequireAuth>
      ),
    },
    {
      path: "/comentar",
      element: (
        <RequireAuth>
          <MakeReview />
        </RequireAuth>
      ),
    },
    {
      path: "/config",
      element: (
        <RequireAuth>
          <Settings />
        </RequireAuth>
      ),
    },
  ],
  { basename: "/zero-lio" }
);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
