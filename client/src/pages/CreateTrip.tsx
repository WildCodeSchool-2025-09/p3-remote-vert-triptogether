import { useNavigate } from "react-router";
import "../styles/CreateTrip.css";
import { Autocomplete, useJsApiLoader } from "@react-google-maps/api";
import { useRef, useState } from "react";
import toast from "react-hot-toast";

export default function CreateTrip() {
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("France");
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_APP_GOOGLE_MAPS_API_KEY || "",
    libraries: ["places"],
  });

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    city: "",
    country: "",
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const departureDate = new Date(formData.start_at);
    const returnDate = new Date(formData.end_at);

    if (departureDate < today) {
      toast.error("La date de départ ne peut pas être dans le passé");
      return;
    }
    if (returnDate < departureDate) {
      toast.error("La date de retour doit être après la date de départ");
      return;
    }

    try {
      const response = await fetch("http://localhost:3310/api/trip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      toast.success("Voyage créé avec succès !");
      setTimeout(() => navigate(-1), 500);
    } catch (error) {
      console.error(error);
      toast.error("Impossible de créer le voyage. Réessayez.");
    }
  };

  return (
    <div className="create-trip-page">
      <img src="/logos/logo-airplane.png" alt="logo-avion" />
      <h1>Créer un nouveau voyage</h1>
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

        <div className="form-group">
          <label htmlFor="city">Ville *</label>
          {isLoaded && (
            <Autocomplete
              onLoad={(autocomplete) => {
                autocompleteRef.current = autocomplete;
              }}
              onPlaceChanged={() => {
                const place = autocompleteRef.current?.getPlace();
                if (!place) return;

                const cityName = place.name || "";

                const countryComp = place.address_components?.find((comp) =>
                  comp.types.includes("country"),
                );
                const countryName = countryComp?.long_name;

                setCity(cityName);
                if (countryName) setCountry(countryName);

                setFormData({
                  ...formData,
                  city: cityName,
                  country: countryName || formData.country,
                });
              }}
            >
              <input
                type="text"
                id="city"
                placeholder="Entrez la ville"
                value={city}
                onChange={(e) => {
                  setCity(e.target.value);
                  setFormData({ ...formData, city: e.target.value });
                }}
                required
              />
            </Autocomplete>
          )}
        </div>

        {city && (
          <div className="form-group">
            <label htmlFor="country">Pays*</label>
            <input
              type="text"
              id="country"
              value={country}
              readOnly
              placeholder="Le pays sera rempli automatiquement"
            />
          </div>
        )}

        <div className="date-container">
          <div className="form-group">
            <label htmlFor="start-date">Date de début *</label>
            <input
              type="date"
              id="start-date"
              name="start_at"
              value={formData.start_at}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="end-date">Date de fin *</label>
            <input
              type="date"
              id="end-date"
              name="end_at"
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
