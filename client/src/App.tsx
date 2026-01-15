import { Outlet } from "react-router";
import "./App.css";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <main>
      <Toaster />
      <Outlet />
    </main>
  );
}

export default App;
