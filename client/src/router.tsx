import { createBrowserRouter } from "react-router";
import App from "./App";
import Invitation from "./pages/Invitation";
import TripInvitations from "./pages/tripInvitations";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/invitation/:id",
    element: <Invitation />,
  },
  {
    path: "trips/:id/invitations",
    element: <TripInvitations />,
  },
] as const);
