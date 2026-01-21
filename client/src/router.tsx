import { createBrowserRouter } from "react-router";

import App from "./App";
import CreateTrip from "./pages/CreateTrip";
import MyTrips from "./pages/MyTrips";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/create-trip",
        element: <CreateTrip />,
      },
      {
        path: "/my-trips",
        element: <MyTrips />,
      },
    ],
  },
]);
