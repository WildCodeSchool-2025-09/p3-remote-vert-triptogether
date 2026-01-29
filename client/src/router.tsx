import { createBrowserRouter } from "react-router";
import App from "./App";
import CreateTrip from "./pages/CreateTrip";
import Invitation from "./pages/Invitation";
import MyTrips from "./pages/MyTrips";
import Login from "./pages/Auth";
import Register from "./pages/AuthRegister";

export const router = createBrowserRouter([

  {
    path: "/",
    element: <App />,
children: [
  { path: "login", element: <Login /> },
  { path: "register", element: <Register /> },
  { path: "create-trip", element: <CreateTrip /> },
  { path: "invitation/:id", element: <Invitation /> },
  { path: "my-trips", element: <MyTrips /> },
]}] as const);
