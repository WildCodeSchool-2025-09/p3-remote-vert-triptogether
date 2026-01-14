import { Routes, Route } from "react-router-dom";
import CreateTrip from "../pages/CreateTrip";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/create-trip" element={<CreateTrip />} />
    </Routes>
  );
}
