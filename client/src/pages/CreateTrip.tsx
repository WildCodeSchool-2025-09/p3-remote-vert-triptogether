import CreateTripForm from "../components/CreateTripForm";
import "../styles/CreateTrip.css";

export default function CreateTrip() {
  return (
    <div className="create-trip-page">
      <img src="/logos/logo-airplane.png" alt="logo-avion" />
      <h1>Créer un nouveau voyage</h1>
      <p>Commencez par définir les bases de votre aventure</p>
      <CreateTripForm />
    </div>
  );
}
