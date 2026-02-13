import { useState } from "react";
import { Link, useNavigate } from "react-router";
import "../pages/styles/Navbar.css";
import { useAuth } from "../contexts/AuthContext";

export default function Navbar() {
  const navigate = useNavigate();
  const [openNavBar, setOpenNavBar] = useState(false);
  const { auth, logout } = useAuth();

  function navigateToCreateTrip() {
    navigate("/create-trip");
  }

  function toggleMenu() {
    setOpenNavBar((v) => !v);
  }

  function closeMenu() {
    setOpenNavBar(false);
  }

  function hello() {
    const now = new Date();
    const hour = now.getHours();
    return hour < 17 ? "Bonjour" : "Bonsoir";
  }

  return (
    <nav className="navbar navbar-container">
      <div className="navbar-left">
        <img
          src="../../public/logos/logo.png"
          className="navbar-logo"
          alt="Logo"
        />
        <div className="website-name">Trip Together</div>
      </div>

      <div className="navbar-center">
        <Link className="navbar-page-title" to="/my-trips">
          Mes voyages
        </Link>
      </div>

      <div className="navbar-right">
        <button
          type="button"
          className="navbar-cta"
          onClick={navigateToCreateTrip}
        >
          C'est parti !
        </button>

        <div className="navbar-profile">
          <button
            type="button"
            className="navbar-profile-Button"
            aria-label="Profil"
            onClick={toggleMenu}
          >
            <img src="/images/utilisateur.png" className="user-icone" alt="" />
          </button>

          <div
            className={`navbar-menu ${openNavBar ? "is-open" : ""}`}
            role="menu"
          >
            <div className="navbar-username">
              {auth ? (
                <>
                  <li>
                    {hello()} {auth.user.firstname}
                  </li>
                  <li>
                    <Link
                      className="navbar-menuLink"
                      to="/account"
                      onClick={closeMenu}
                    >
                      Mon compte
                    </Link>
                    <button type="button" onClick={logout}>
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link to="/login">Login</Link>
                  </li>
                  <li>
                    <Link to="/register">Register</Link>
                  </li>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
