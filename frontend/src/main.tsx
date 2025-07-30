import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import "./index.css";
import App from "./App.tsx";
import Home from "./pages/Home.tsx";

const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/canchas", element: <Home /> },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
