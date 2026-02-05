import { createBrowserRouter } from "react-router";
import App from "./App";
import CreateTrip from "./pages/CreateTrip";
import Invitation from "./pages/Invitation";
import Invitations from "./pages/Invitations";
import { Trip } from "./pages/Trip";
import TripInvitations from "./pages/tripInvitations";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/trip/:tripId/invitation/:invitationId",
        element: <Invitation />,
      },
      {
        path: "/trip/:id",
        element: <Trip />,
      },
      {
        path: "/trip/:id/invitations",
        element: <Invitations />,
      },
      {
        path: "/create-trip",
        element: <CreateTrip />,
      },
      {
        path: "trips/:id/invitations",
        element: <TripInvitations />,
      },
    ],
  },
] as const);
