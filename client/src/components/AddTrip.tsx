import { useJsApiLoader } from "@react-google-maps/api";
import { useEffect, useRef, useState } from "react";
import { useJsApiLoader } from "@react-google-maps/api";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import { GOOGLE_MAPS_LIBRARIES } from "../constants/maps";
import { GOOGLE_MAPS_LIBRARIES } from "../constants/maps";
import { useAuth } from "../contexts/AuthContext";
import "../pages/styles/AddTrip.css";

interface AddStepProps {
  onStepAdded: () => void;
}

export default function AddStep({ onStepAdded }: AddStepProps) {
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const inputRef = useRef<HTMLDivElement>(null);
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const placeAutocompleteRef = useRef<any>(null);
  const inputRef = useRef<HTMLDivElement>(null);
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const placeAutocompleteRef = useRef<any>(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_APP_GOOGLE_MAPS_API_KEY || "",
    libraries: GOOGLE_MAPS_LIBRARIES,
    libraries: GOOGLE_MAPS_LIBRARIES,
  });

  useEffect(() => {
    if (!isLoaded || !inputRef.current) return;

    if (placeAutocompleteRef.current) {
      if (!inputRef.current.contains(placeAutocompleteRef.current)) {
        inputRef.current.appendChild(placeAutocompleteRef.current);
      }
      return;
    }

    const initAutocomplete = async () => {
      try {
        // Importation dynamique de la librairie "places"
        // @ts-ignore
        const { PlaceAutocompleteElement } = (await google.maps.importLibrary(
          "places",
        )) as google.maps.PlacesLibrary;

        // @ts-ignore
        const autocomplete = new PlaceAutocompleteElement();
        placeAutocompleteRef.current = autocomplete;

        // biome-ignore lint/style/noNonNullAssertion: <explanation>
        inputRef.current!.innerHTML = "";
        // biome-ignore lint/style/noNonNullAssertion: <explanation>
        inputRef.current!.appendChild(autocomplete);

        autocomplete.addEventListener("gmp-places-select", async (e: Event) => {
          // biome-ignore lint/suspicious/noExplicitAny: <explanation>
          const place = (e as any).place;
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
          const photoUrl = place.photos?.[0]?.getUrl({ maxWidth: 400 }) || "";

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
      } catch (error) {
        console.error("Error loading Google Maps Places library:", error);
      }
    };

    initAutocomplete();
  }, [isLoaded]);

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

    let currentCity = city;
    if (!currentCity && placeAutocompleteRef.current) {
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      currentCity = (placeAutocompleteRef.current as any).value;
    }

    let currentCity = city;
    if (!currentCity && placeAutocompleteRef.current) {
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      currentCity = (placeAutocompleteRef.current as any).value;
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
            city: currentCity,
            city: currentCity,
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

      if (placeAutocompleteRef.current) {
        placeAutocompleteRef.current.value = "";
      }

      if (placeAutocompleteRef.current) {
        placeAutocompleteRef.current.value = "";
      }

      onStepAdded();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="add-step-form-container">
      <form className="add-step-form" onSubmit={handleAddStep}>
        <div className="add-step-form-group">
          <label htmlFor="city">Adresse</label>
          <div
            className="input-container"
            ref={inputRef}
            style={{ width: "100%" }}
          <label htmlFor="city">Adresse</label>
          <div
            className="input-container"
            ref={inputRef}
            style={{ width: "100%" }}
          />
        </div>


        <button type="submit" className="add-btn">
          Ajouter cette étape
        </button>
      </form>
    </div>
  );
}
