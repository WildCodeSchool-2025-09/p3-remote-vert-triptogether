import { createBrowserRouter } from "react-router";
import App from "./App";
import Login from "./pages/Auth";
import Register from "./pages/AuthRegister";
import CreateTrip from "./pages/CreateTrip";
import Invitation from "./pages/Invitation";
import Invitations from "./pages/Invitations";
import MyTrips from "./pages/MyTrips";
import { Trip } from "./pages/Trip";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "invitation/:id", element: <Invitation /> },
      { path: "my-trips", element: <MyTrips /> },
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
