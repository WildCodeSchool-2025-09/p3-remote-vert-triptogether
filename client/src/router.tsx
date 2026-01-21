import { createBrowserRouter } from "react-router";
import App from "./App";
import Invitation from "./pages/Invitation";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/invitation/:id",
    element: <Invitation />,
  },
] as const);
