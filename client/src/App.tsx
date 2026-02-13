import { Outlet } from "react-router";
import { ToastContainer } from "react-toastify";
import "./pages/styles/Reset.css";
import "./pages/styles/App.css";
import Navbar from "./components/Navbar";
import { useToast } from "./hooks/useToast";
import "./App.css";

function App() {
  useToast();

  return (
    <>
      <header>
        <Navbar />
      </header>

      <main>
        <Outlet />
      </main>
      <ToastContainer position="top-right" autoClose={3000} theme="light" />
    </>
  );
}

export default App;
