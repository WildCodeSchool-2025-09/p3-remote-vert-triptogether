import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import "./styles/CreateTrip.css";
import "./styles/mobile.css";
import { Autocomplete, useJsApiLoader } from "@react-google-maps/api";
import backArrowLogo from "../assets/images/back-arrow-logo.png";
import { useAuth } from "../contexts/AuthContext";

const libraries: "places"[] = ["places"];

export default function CreateTrip() {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const token = localStorage.getItem("token") || auth?.token;
  useEffect(() => {
    if (!token) return;
    if (!auth?.token) {
      toast.error("Vous devez être connecté pour créer un voyage");
      navigate("/login");
    }
  }, [token, auth?.token, navigate]);
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("France");
  const [imageUrl, setImageUrl] = useState("");
  const [endOfTrip, setEndOfTrip] = useState({ end_at: "" });
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const titleRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLInputElement>(null);
  const startAtRef = useRef<HTMLInputElement>(null);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayString = today.toISOString().slice(0, 10);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_APP_GOOGLE_MAPS_API_KEY || "",
    libraries,
  });

  const onPlaceChanged = () => {
    const place = autocompleteRef.current?.getPlace();
    if (!place) return;

    const cityName = place.name || "";
    const countryComp = place.address_components?.find((comp) =>
      comp.types.includes("country"),
    );
    const countryName = countryComp?.long_name;
    const photoUrl = place.photos?.[0]?.getUrl({ maxWidth: 1200 }) || "";

    setCity(cityName);
    if (countryName) setCountry(countryName);
    setImageUrl(photoUrl);
  };

  const submitCreateTrip = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newTrip = {
      title: titleRef.current?.value,
      description: descriptionRef.current?.value,
      start_at: startAtRef.current?.value,
      end_at: endOfTrip.end_at,
      city,
      country,
      image_url: imageUrl,
    };

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/trips`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newTrip),
        },
      );

      if (response.ok) {
        await response.json();
        navigate("/my-trips");
        const result = await response.json();
        navigate(`/trip/${result.insertId}`);
      } else {
        const result = await response.json();
        toast.error(result.error || "Erreur lors de la création");
      }
    } catch (err) {
      toast.error("Impossible de créer le voyage.");
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
            ref={titleRef}
            placeholder="Nom du voyage"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description *</label>
          <input
            type="text"
            id="description"
            ref={descriptionRef}
            placeholder="Description"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="city">Ville *</label>
          {isLoaded && (
            <Autocomplete
              onLoad={(a) => {
                autocompleteRef.current = a;
              }}
              onPlaceChanged={onPlaceChanged}
            >
              <input
                type="text"
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Recherchez une destination"
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
              readOnly
              placeholder="Pays automatiquement"
            />
          </div>
        )}

        <div className="date-container">
          <div className="form-group">
            <label htmlFor="start-date">Date de début *</label>
            <input
              type="date"
              id="start-date"
              ref={startAtRef}
              min={todayString}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="end-date">Date de fin *</label>
            <input
              type="date"
              id="end-date"
              value={endOfTrip.end_at}
              onChange={(e) => setEndOfTrip({ end_at: e.target.value })}
              min={todayString}
              required
            />
          </div>
        </div>

        <div className="button-container">
          <button type="button" onClick={() => navigate(-1)}>
            Annuler
          </button>
          <button type="submit">Créer le voyage</button>
        </div>
      </form>
    </div>
  );
}
