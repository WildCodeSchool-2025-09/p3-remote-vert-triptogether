import { Autocomplete, useJsApiLoader } from "@react-google-maps/api";
import { useRef, useState } from "react";
import { useParams } from "react-router";
import { useAuth } from "../../contexts/AuthContext";
import "./AddTrip.css";

const libraries: "places"[] = ["places"];

interface AddStepProps {
  onStepAdded: () => void;
}

export default function AddStep({ onStepAdded }: AddStepProps) {
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

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
    const photoUrl = place.photos?.[0]?.getUrl() || "";

    setCity(cityName);
    if (countryName) setCountry(countryName);
    setImageUrl(photoUrl);
  };

  const { auth } = useAuth();
  const { tripId: routeTripId, id } = useParams();
  const tripId = routeTripId || id;

  const handleAddStep = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token") || auth?.token;
    if (!token) return;

    const user_id = auth?.user?.id;
    if (!user_id) {
      console.error("User ID missing from auth context");
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/trips/${tripId}/steps`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            city,
            country,
            user_id,
            image_url: imageUrl,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Erreur lors de l'ajout de l'étape");
      }

      setCity("");
      setCountry("");
      setImageUrl("");

      onStepAdded();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="add-step-form-container">
      <form className="add-step-form" onSubmit={handleAddStep}>
        <div className="add-step-form-group">
          <label htmlFor="city">Ville</label>
          {isLoaded ? (
            <Autocomplete
              onLoad={(a) => {
                autocompleteRef.current = a;
              }}
              onPlaceChanged={onPlaceChanged}
            >
              <input
                type="text"
                id="city"
                name="city"
                placeholder="Ex: Paris"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
            </Autocomplete>
          ) : (
            <input
              type="text"
              id="city"
              name="city"
              placeholder="Ex: Paris"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
          )}
        </div>
        <div className="add-step-form-group">
          <label htmlFor="country">Pays</label>
          <input
            type="text"
            id="country"
            name="country"
            placeholder="Ex: France"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="add-btn">
          Ajouter cette étape
        </button>
      </form>
    </div>
  );
}
