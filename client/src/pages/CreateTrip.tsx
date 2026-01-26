import { useRef, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import "../styles/CreateTrip.css";
import "../styles/mobile.css";
import backArrowLogo from "../assets/images/back-arrow-logo.png";

export default function CreateTrip() {
  const [endOfTrip, setEndOfTrip] = useState({ end_at: "" });

  const titleRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLInputElement>(null);
  const startAtRef = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayString = today.toLocaleDateString("fr-CA");

  const submitCreateTrip = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!titleRef.current || !descriptionRef.current || !startAtRef.current) {
      toast.error("Formulaire incomplet");
      return;
    }

    const newTrip = {
      title: titleRef.current.value,
      description: descriptionRef.current.value,
      start_at: startAtRef.current.value,
      end_at: endOfTrip.end_at,
    };

    const departureDate = new Date(startAtRef.current.value);
    const returnDate = new Date(endOfTrip.end_at);

    if (departureDate < today) {
      toast.error("La date de départ ne peut pas être dans le passé");
      return;
    }

    if (returnDate <= departureDate) {
      toast.error("La date de retour doit être après la date de départ");
      return;
    }

    try {
      const response = await fetch("http://localhost:3310/api/trips", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTrip),
      });

      if (!response.ok) {
        const result = await response.json();
        toast.error(result.error);
        return;
      }

      const result = await response.json();
      const tripId = result.insertId;

      navigate(`/trips/${tripId}`);
      // toast.success("Voyage créé avec succès !"); à ajouter ds le composant du voyage créé avec un useEffect
    } catch (error) {
      toast.error("Impossible de créer le voyage. Réessayez.");
    }
  };

  return (
    <div className="create-trip-page">
      <div className="container-back-arrow">
        <button
          type="button"
          className="button-back-arrow"
          onClick={() => navigate(-1)}
          aria-label="Retour"
        >
          <img className="back-arrow" src={backArrowLogo} alt="" />
        </button>
      </div>

      <img src="/logos/logo-airplane.png" alt="logo-avion" />
      <h1>
        Créer un nouveau <span>voyage</span>
      </h1>
      <p>Commencez par définir les bases de votre aventure</p>
      <form className="create-trip-form" onSubmit={submitCreateTrip}>
        <div className="form-group">
          <label htmlFor="trip-name">Nom du voyage *</label>
          <input
            type="text"
            id="trip-name"
            name="title"
            placeholder="Entrez le nom du voyage"
            ref={titleRef}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description *</label>
          <input
            type="text"
            id="description"
            name="description"
            placeholder="Entrez la description"
            ref={descriptionRef}
            required
          />
        </div>

        <div className="date-container">
          <div className="form-group">
            <label htmlFor="start-date">Date de début *</label>
            <input
              type="date"
              name="start_at"
              min={todayString}
              ref={startAtRef}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="end-date">Date de fin *</label>
            <input
              type="date"
              name="end_at"
              min={todayString}
              value={endOfTrip.end_at}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEndOfTrip({ end_at: e.target.value })
              }
              required
            />
          </div>
        </div>

        <div className="astuces-container">
          <label htmlFor="tips">
            💡 Vous pourrez inviter des membres et ajouter des destinations une
            fois le voyage créé. Un voyage nécessite au minimum 2 participants.
          </label>
        </div>

        <div className="button-container">
          <button
            type="button"
            className="cancel-button"
            onClick={() => navigate(-1)}
          >
            Annuler
          </button>
          <button type="submit" className="create-trip-button">
            Créer le voyage
          </button>
        </div>
      </form>
    </div>
  );
}
