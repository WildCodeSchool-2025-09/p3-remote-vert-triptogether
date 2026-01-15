import { useNavigate } from "react-router";
import CreateTripForm from "../components/CreateTripForm";
import "../styles/CreateTrip.css";

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
          src="../src/assets/images/back-arrow-logo.png"
          alt="flèche de retour arrière"
        />
      </button>
      <img src="/logos/logo-airplane.png" alt="logo-avion" />
      <h1>Créer un nouveau voyage</h1>
      <p>Commencez par définir les bases de votre aventure</p>
      <CreateTripForm />
    </div>
  );
}
