import { Link, Outlet } from "react-router";
import { ToastContainer } from "react-toastify";
import "./App.css";
import { useAuth } from "./contexts/AuthContext";

function App() {
  const { auth, logout } = useAuth();
  return (
    <>
      <nav>
        <ul className="Testnavbar">
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
                <Link to="/my-trips">Mes voyages</Link>
              </li>
              <li>
                <button type="button" onClick={logout}>
                  Logout
                </button>
              </li>
              {auth && <p>Hello {auth.user.email}</p>}
            </>
          )}
        </ul>
      </nav>
      <main>
        <Outlet />
      </main>
      <ToastContainer position="top-center" autoClose={5000} theme="light" />
    </>
  );
}

export default App;
