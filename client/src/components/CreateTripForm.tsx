import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateTripForm() {
  const [formData, setFormData] = useState({
    tripName: "",
    destination: "",
    startDate: "",
    endDate: "",
  });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
 const response = await fetch("http://localhost:3310/api/trips", {
  method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la création du voyage");
      }

      alert("Voyage créé avec succès !");
      navigate(-1);
    } catch (error) {
      console.error(error);
      alert("Impossible de créer le voyage. Réessayez.");
    }
  };

  return (
    <div className="create-trip-page">
      <form className="create-trip-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="trip-name">Nom du voyage *</label>
          <input
            type="text"
            id="trip-name"
            name="tripName"
            placeholder="Entrez le nom du voyage"
            value={formData.tripName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="destination">Destination principale *</label>
          <input
            type="text"
            id="destination"
            name="destination"
            placeholder="Entrez la destination"
            value={formData.destination}
            onChange={handleChange}
            required
          />
        </div>

        <div className="date-container">
          <div className="form-group">
            <label htmlFor="start-date">Date de début *</label>
            <input
              type="date"
              id="start-date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="end-date">Date de fin *</label>
            <input
              type="date"
              id="end-date"
              name="endDate"
              value={formData.endDate}
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
