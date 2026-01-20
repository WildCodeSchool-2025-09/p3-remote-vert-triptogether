import { useNavigate } from "react-router";
import CreateTripForm from "../components/CreateTripForm";
import "../styles/CreateTrip.css";
import "../styles/mobile.css";

export default function CreateTrip() {
  const navigate = useNavigate();

  return (
    <div className="create-trip-page">
      <button
        type="button"
        className="button-back-arrow"
        onClick={() => navigate(-1)}
      >
        <img
          className="back-arrow"
          src="../src/assets/images/back-arrow-logo.png"
          alt="flèche de retour arrière"
        />
      </button>
      <div className="create-trip-main-content">
        <div className="header-create-new-trip">
          <img
            className="logo-airplane"
            src="/logos/logo-airplane.png"
            alt="logo-avion"
          />
          <h1>
            Créer un nouveau <span className="voyage-vert">voyage</span>
          </h1>
          <p>Commencez par définir les bases de votre aventure</p>
        </div>

        <div className="form-section">
          <CreateTripForm />
        </div>
      </div>
    </div>
  );
}

const pets = ["dog", "cat", "turtle", "bat"];

console.log(pets.length);
