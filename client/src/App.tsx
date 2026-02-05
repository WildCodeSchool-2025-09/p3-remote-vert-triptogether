import { Link, Outlet } from "react-router";
import { ToastContainer } from "react-toastify";
import "./App.css";
import { useAuth } from "./contexts/AuthContext";





function App() {
  const { auth, logout } = useAuth();

  return (
    <>
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
                <Link to="/my-trips">Mes voyages</Link>
              </li>
              <li>
                <Link to="/trip/:id/invitation/:invitationId">Mes invitations</Link>
              </li>
              <li>
                <button type="button" onClick={logout}>
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>
      </nav>
      {auth && <p>Hello {auth.user.email}</p>}
      <main>
        <Outlet />
      </main>
      <ToastContainer position="top-center" autoClose={5000} theme="light" />
    </>
  );
}

export default App;
