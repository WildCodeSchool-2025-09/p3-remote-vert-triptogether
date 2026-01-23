import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import "../styles/CreateTrip.css";
import "../styles/mobile.css";

export default function CreateTrip() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    start_at: "",
    end_at: "",
  });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayString = today.toLocaleDateString("fr-CA").split("T")[0];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const departureDate = new Date(formData.start_at);
    const returnDate = new Date(formData.end_at);

    if (departureDate < today) {
      toast.error("La date de départ ne peut pas être dans le passé");
      return;
    }

    if (returnDate <= departureDate) {
      toast.error("La date de retour doit être après la date de départ");
      return;
    }

    try {
      const response = await fetch("http://localhost:3310/api/trip", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      toast.success("Voyage créé avec succès !");

      setTimeout(() => {
        navigate(-1);
      }, 3000);
    } catch (error) {
      console.error(error);
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
          <img
            className="back-arrow"
            src="../src/assets/images/back-arrow-logo.png"
            alt=""
          />
        </button>
      </div>

      <img src="/logos/logo-airplane.png" alt="logo-avion" />
      <h1>
        Créer un nouveau <span>voyage</span>
      </h1>
      <p>Commencez par définir les bases de votre aventure</p>
      <form className="create-trip-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="trip-name">Nom du voyage *</label>
          <input
            type="text"
            id="trip-name"
            name="title"
            placeholder="Entrez le nom du voyage"
            value={formData.title}
            onChange={handleChange}
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
            value={formData.description}
            onChange={handleChange}
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
              value={formData.start_at}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="end-date">Date de fin *</label>
            <input
              type="date"
              name="end_at"
              min={formData.start_at || todayString}
              value={formData.end_at}
              onChange={handleChange}
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
