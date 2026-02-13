import { Navigate, createBrowserRouter } from "react-router";
import App from "./App";
import Account from "./components/Account";
import CreateTrip from "./pages/CreateTrip";
import Invitation from "./pages/Invitation";
import Invitations from "./pages/Invitations";
import Login from "./pages/Login";
import MyTrips from "./pages/MyTrips";
import Register from "./pages/Register";
import Steps from "./pages/Steps";
import Trip from "./pages/Trip";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Navigate to="my-trips" replace />,
      },
      { path: "account", element: <Account /> },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "my-trips",
        element: <MyTrips />,
      },
      {
        path: "create-trip",
        element: <CreateTrip />,
      },
      {
        path: "trip/:id",
        element: <Trip />,
      },
      {
        path: "trip/:id/steps",
        element: <Steps />,
      },
      {
        path: "trip/:id/invitations",
        element: <Invitations />,
      },
      {
        path: "trip/:id/invitation/:invitationId",
        element: <Invitation />,
      },
    ],
  },
] as const);
