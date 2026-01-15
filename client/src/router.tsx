import { createBrowserRouter } from "react-router";
import App from "./App";
import Invitation from "./pages/invitation/invitation";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/invitation/",
    element: <Invitation />,
  },
  {
    path: "/invitation/:id",
    element: <Invitation />,
  },
] as const);
