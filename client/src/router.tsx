import { createBrowserRouter } from "react-router";
import App from "./App";
import Invitation from "./pages/Invitation";
import Membres from "./pages/Membres";
import { Trip } from "./pages/Trip";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/invitation/:id",
        element: <Invitation />,
      },
      {
        path: "/trip/:id",
        element: <Trip />,
      },
      {
        path: "/trip/:id/explorer",
        element: <Membres />, //TODO CREER COMPOSANT EXPLORER (anciennemnt destination)
      },
      {
        path: "/trip/:id/membres",
        element: <Membres />,
      },
      {
        path: "/trip/:id/map",
        element: <Membres />, //TODO CREER COMPOSANT MAP
      },
      {
        path: "/trip/:id/budget",
        element: <Membres />, //TODO CREER COMPOSANT BUDGET
      },
      {
        path: "/trip/:id/chat",
        element: <Membres />, //TODO CREER COMPOSANT TCHAT
      },
    ],
  },
] as const);
