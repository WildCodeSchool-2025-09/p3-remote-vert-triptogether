import { useState } from "react";
import { Link, useNavigate } from "react-router";
import "../pages/styles/Navbar.css";
import { useAuth } from "../contexts/AuthContext";

export default function Navbar() {
  const navigate = useNavigate();
  const [openNavBar, setOpenNavBar] = useState(false);
  const { auth, logout } = useAuth(); // AJOUTER l'import de useAuth

  function navigateToCreateTrip() {
    navigate("/create-trip");
    closeMenu();
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

  const closelogout = () => {
    logout();
    closeMenu();
  };

  return (
    <nav className="navbar navbar-container">
      <div className="navbar-left">
        <Link to="/" onClick={closeMenu}>
          {/* Attention au chemin de l'image, c'est souvent "/logos/logo.png" sans "public" */}
          <img src="/logos/logo.png" className="navbar-logo" alt="Logo" />
        </Link>
        <Link to="/" onClick={closeMenu}>
          <div className="website-name">Trip Together</div>
        </Link>
      </div>

      <div className="navbar-center">
        <Link className="navbar-page-title" to="/my-trips" onClick={closeMenu}>
          Mes voyages
        </Link>
      </div>

      <div className="navbar-right">
        {/* Bouton "C'est parti !" visible SEULEMENT si connecté */}
        {auth && (
          <button
            type="button"
            className="navbar-cta"
            onClick={navigateToCreateTrip}
          >
            C'est parti !
          </button>
        )}

        <div className="navbar-profile">
          {auth ? (
            /* --- SI CONNECTÉ : Affiche le bouton profil + menu --- */
            /* Enveloppe ton bloc existant ici */
            <div>
              <button
                type="button"
                className="navbar-profile-Button"
                aria-label="Profil"
                onClick={toggleMenu}
              >
                <img
                  src="/images/utilisateur.png"
                  className="user-icone"
                  alt=""
                />
              </button>

              <div
                className={`navbar-menu ${openNavBar ? "is-open" : ""}`}
                role="menu"
              >
                <div className="navbar-username">
                  <div className="navbar-username">
                    {hello()} {auth.user.firstname}
                  </div>
                  <div>
                    <Link
                      className="navbar-menuLink"
                      to="/account"
                      onClick={closeMenu}
                    >
                      Mon compte
                    </Link>
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={closelogout}
                      className="navbar-logout-btn"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* --- SI PAS CONNECTÉ : Affiche les liens directs (plus besoin de menu caché) --- */
            <div className="navbar-auth-links">
              <Link to="/login" className="navbar-auth-link">
                Se connecter
              </Link>
              <Link
                to="/register"
                className="navbar-auth-link navbar-auth-register"
              >
                Créer un compte
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
