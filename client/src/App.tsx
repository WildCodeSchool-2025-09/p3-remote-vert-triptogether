import { Link, Outlet } from "react-router";
import { ToastContainer } from "react-toastify";
import Navbar from "./components/Navbar";
import "./App.css";
import { useState } from "react";

type User = {
  id: number;
  email: string;
};

type Auth = {
  user: User;
  token: string;
};

function App() {
  const [auth, setAuth] = useState<Auth | null>(() => {
    const savedAuth = localStorage.getItem("auth");
    return savedAuth ? JSON.parse(savedAuth) : null;
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("auth");
    setAuth(null);
  };

  return (
    <>
      <header>
        <Navbar />
      </header>

      <main>
        <ToastContainer position="top-center" autoClose={5000} theme="light" />
        <Outlet context={{ auth, setAuth }} />
      </main>

      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          {auth == null ? (
            <>
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/register">Register</Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/create-trip">Créer un voyage</Link>
              </li>
              <li>
                <button type="button" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>
      </nav>

      {auth && <p>Hello {auth.user.email}</p>}
    </>
  );
}

export default App;
