import { createBrowserRouter } from "react-router";
import App from "./App";
import Invitation from "./pages/Invitation";
import Membres from "./pages/Members";
import { Trip } from "./pages/Trip";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/trip/:id/invitation",
        element: <Invitation />,
      },
      {
        path: "/trip/:id",
        element: <Trip />,
      },
      {
        path: "/trip/:id/membres",
        element: <Membres />,
      },
    ],
  },
] as const);
