import { useRef, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import "../styles/CreateTrip.css";
import "../styles/mobile.css";
import { Autocomplete, useJsApiLoader } from "@react-google-maps/api";
import backArrowLogo from "../assets/images/back-arrow-logo.png";

export default function CreateTrip() {
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("France");
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_APP_GOOGLE_MAPS_API_KEY || "",
    libraries: ["places"],
  });
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
      city,
      country,
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
      <button
        type="button"
        className="button-back-arrow"
        onClick={() => navigate(-1)}
        aria-label="Retour"
      >
        <img className="back-arrow" src={backArrowLogo} alt="" />
      </button>

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
              }}
            >
              <input
                type="text"
                id="city"
                placeholder="Recherchez une destination"
                name="city"
                value={city}
                onChange={(e) => {
                  setCity(e.target.value);
                }}
                required
              />
            </Autocomplete>
          )}
        </div>

        {city && (
          <div className="form-group country">
            <label htmlFor="country">Pays*</label>
            <input
              type="text"
              id="country"
              value={country}
              name="country"
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
