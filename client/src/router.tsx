import { createBrowserRouter } from "react-router";
import App from "./App";
import Account from "./components/Account";
import CreateTrip from "./pages/CreateTrip";
import Invitation from "./pages/Invitation";
import Invitations from "./pages/Invitations";
import Login from "./pages/Login";
import MyTrips from "./pages/MyTrips";
import Register from "./pages/Register";
import { Trip } from "./pages/Trip";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "create-trip", element: <CreateTrip /> },
      { path: "invitation/:id", element: <Invitation /> },
      { path: "account", element: <Account /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
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
