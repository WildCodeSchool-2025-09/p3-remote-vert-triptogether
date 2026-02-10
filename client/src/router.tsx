import { createBrowserRouter } from "react-router";
import App from "./App";
import Account from "./components/Account";
import CreateTrip from "./pages/CreateTrip";
import Invitation from "./pages/Invitation";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "create-trip", element: <CreateTrip /> },
      { path: "invitation/:id", element: <Invitation /> },
      { path: "account", element: <Account /> },
    ],
  },
] as const);
