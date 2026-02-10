import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import "../pages/styles/Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const username = "Kevin Ressegaire";

  function navigateToCreateTrip() {
    navigate("/create-trip");
  }

  function toggleMenu() {
    setOpen((v) => !v);
  }

  function closeMenu() {
    setOpen(false);
  }

  return (
    <header
      className={`navbar ${
        location.pathname.startsWith("/create-trip") ? "on-create-trip" : ""
      }`}
    >
      <nav className="navbar-container">
        <div className="navbar-left">
          <img
            src="../../public/logos/logo.png"
            className="navbar-logo"
            alt="Logo"
          />
          <div className="website-name">Trip Together</div>
        </div>

        <div className="navbar-center">
          <Link className="navbar-page-title" to="/trips">
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
              👤
            </button>

            <div className={`navbar-menu ${open ? "is-open" : ""}`} role="menu">
              <div className="navbar-username">{username}</div>

              <Link
                className="navbar-menuLink"
                to="/account"
                onClick={closeMenu}
              >
                Mon compte
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
