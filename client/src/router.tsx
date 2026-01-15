import { createBrowserRouter } from "react-router";

import App from "./App";
import CreateTrip from "./pages/CreateTrip";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/create-trip",
        element: <CreateTrip />,
      },
    ],
  },
]);
