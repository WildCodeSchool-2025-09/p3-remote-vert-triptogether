import { createBrowserRouter } from "react-router";
import App from "./App";
import CreateTrip from "./pages/CreateTrip";
import Home from "./pages/Home";
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
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "my-trips", element: <MyTrips /> },
      {
        index: true,
        element: <Home />,
      },
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
