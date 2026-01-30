import { createBrowserRouter } from "react-router";
import App from "./App";
import CreateTrip from "./pages/CreateTrip";
import Invitation from "./pages/Invitation";
import Invitations from "./pages/Invitations";
import { Trip } from "./pages/Trip";

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
    ],
  },
] as const);
