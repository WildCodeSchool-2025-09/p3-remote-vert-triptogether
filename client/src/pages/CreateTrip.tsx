import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import "./styles/CreateTrip.css";
import "./styles/mobile.css";
import { useJsApiLoader } from "@react-google-maps/api";
import backArrowLogo from "../assets/images/back-arrow-logo.png";
import { GOOGLE_MAPS_LIBRARIES } from "../constants/maps";
import { useAuth } from "../contexts/AuthContext";

export default function CreateTrip() {
  const { auth } = useAuth();

  const [city, setCity] = useState("");
  const [country, setCountry] = useState("France");
  const [imageUrl, setImageUrl] = useState("");
  const [endOfTrip, setEndOfTrip] = useState({ end_at: "" });

  const inputRef = useRef<HTMLDivElement>(null);
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const placeAutocompleteRef = useRef<any>(null);

  const titleRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLInputElement>(null);
  const startAtRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayString = today.toISOString().slice(0, 10);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_APP_GOOGLE_MAPS_API_KEY || "",
    libraries: GOOGLE_MAPS_LIBRARIES,
  });

  useEffect(() => {
    if (!isLoaded || !inputRef.current) return;

    if (placeAutocompleteRef.current) {
      inputRef.current.appendChild(placeAutocompleteRef.current);
      return;
    }

    const initAutocomplete = () => {
      // @ts-ignore
      const autocomplete = new google.maps.places.PlaceAutocompleteElement();
      placeAutocompleteRef.current = autocomplete;

      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      inputRef.current!.innerHTML = "";
      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      inputRef.current!.appendChild(autocomplete);

      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      autocomplete.addEventListener("gmp-places-select", async (event: any) => {
        const place = event.place;
        if (!place) return;

        await place.fetchFields({
          fields: ["address_components", "name", "photos"],
        });

        const cityName = place.name || "";
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        const countryComp = place.address_components?.find((comp: any) =>
          comp.types.includes("country"),
        );
        const countryName = countryComp?.long_name;
        const photoUrl = place.photos?.[0]?.getUrl({ maxWidth: 600 }) || "";

        console.log("Place details fetched:", {
          cityName,
          countryName,
          hasPhoto: !!photoUrl,
        });

        setCity(cityName);
        if (countryName) setCountry(countryName);
        setImageUrl(photoUrl);
      });

      autocomplete.addEventListener("change", () => {
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        setCity((autocomplete as any).value);
      });
    };

    initAutocomplete();
  }, [isLoaded]);

  const submitCreateTrip = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const token = localStorage.getItem("token") || auth?.token;

    if (!token) {
      toast.error("Vous devez être connecté");
      return;
    }

    let currentCity = city;
    if (!currentCity && placeAutocompleteRef.current) {
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      currentCity = (placeAutocompleteRef.current as any).value;
    }

    const newTrip = {
      title: titleRef.current?.value,
      description: descriptionRef.current?.value,
      start_at: startAtRef.current?.value,
      end_at: endOfTrip.end_at,
      city: currentCity,
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
          <label htmlFor="city">Adresse *</label>
          {/* Conteneur pour le composant Google Places */}
          <div ref={inputRef} style={{ width: "100%" }} />
        </div>

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
