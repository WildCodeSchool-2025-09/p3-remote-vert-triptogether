import { createBrowserRouter } from "react-router";
import App from "./App";
import CreateTrip from "./pages/CreateTrip";
import Invitation from "./pages/Invitation";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/create-trip",
    element: <CreateTrip />,
  },
  {
    path: "/invitation/:id",
    element: <Invitation />,
  },
] as const);
