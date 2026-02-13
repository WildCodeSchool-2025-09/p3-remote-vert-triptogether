import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import NavTabs from "../components/NavTabs";
import TripInfos from "../components/TripInfos";
import { useToast } from "../hooks/useToast";
import "./styles/Trip.css";
import type { Trip as TripType } from "../types/tripType";

export function Trip() {
  type RouteParams = {
    id: string;
  };

  const { id } = useParams<RouteParams>();
  const tripId = Number(id);
  const [trip, setTrip] = useState<TripType | null>(null);

  const navigate = useNavigate();
  useToast();

  useEffect(() => {
    if (!tripId) {
      navigate("/", {
        state: {
          toast: {
            type: "error",
            message: "Voyage invalide",
          },
        },
      });
      return;
    }

    fetch(`${import.meta.env.VITE_API_URL}/api/trips/${tripId}`)
      .then(async (response) => {
        if (!response.ok) {
          if (response.status === 401) {
            toast.error("Veuillez vous connecter pour accéder à ce voyage.");
            return;
          }
          throw new Error("Erreur chargement voyage");
        }
        const data = await response.json();
        setTrip(data);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Impossible de charger le voyage");
      });
  }, [tripId, navigate]);
  console.log(trip);
  return (
    <>
      <TripInfos trip={trip} />
      <main className="page">
        <NavTabs />
        <div className="trip-dashboard">
          <h2>Tableau de bord</h2>
          <p>Bienvenue sur le récapitulatif de votre voyage.</p>
        </div>
      </main>
    </>
  );
}
