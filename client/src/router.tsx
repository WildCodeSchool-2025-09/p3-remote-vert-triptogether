import { createBrowserRouter, Navigate } from "react-router";
import App from "./App";
import Login from "./pages/Auth";
import Register from "./pages/AuthRegister";
import CreateTrip from "./pages/CreateTrip";
import Invitation from "./pages/Invitation";
import Invitations from "./pages/Invitations";
import MyTrips from "./pages/MyTrips";
import { Trip } from "./pages/Trip";
import Steps from "./pages/Steps";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      // Redirection ou page par défaut
      { index: true, element: <Navigate to="my-trips" replace /> },
      
      // Routes d'authentification
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      
      // Routes de gestion des voyages
      { path: "my-trips", element: <MyTrips /> },
      { path: "create-trip", element: <CreateTrip /> },
      
      // Routes spécifiques à un voyage (ID)
      { path: "trip/:id", element: <Trip /> },
      { path: "trip/:id/steps", element: <Steps /> },
      { path: "trip/:id/invitations", element: <Invitations /> },
      
      // Route spécifique pour une invitation précise
      { 
        path: "trip/:id/invitation/:invitationId", 
        element: <Invitation /> 
      },
    ],
  },
] as const);