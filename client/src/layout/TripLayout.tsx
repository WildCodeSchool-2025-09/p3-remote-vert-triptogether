import { useEffect, useState } from "react";
import { Outlet, useParams } from "react-router";
import { toast } from "react-toastify";
import NavTabs from "../components/NavTabs/NavTabs";
import TripInfos from "../components/TripInfos/TripInfos";
import type { Trip } from "../types/tripType";

export default function TripLayout() {
  const { id } = useParams<{ id: string }>();
  const [trip, setTrip] = useState<Trip | null>(null);

  useEffect(() => {
    if (!id) return;

    fetch(`${import.meta.env.VITE_API_URL}/api/trips/${id}`)
      .then(async (response) => {
        if (!response.ok) {
          if (response.status === 401) {
            // Gérer l'erreur 401 (ex: redirection vers login)
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
  }, [id]);

  // Determine if we should show the layout elements
  // We generally want them for trip sub-pages
  const showLayout = !!trip;

  if (!showLayout) return <p>Chargement du voyage...</p>;

  return (
    <>
      <TripInfos trip={trip} />
      <main className="page">
        {/* Only show NavTabs on specific pages if needed, 
             or always show them. The original Steps page had them. 
             Invitations didn't have NavTabs in the original code? 
             Let's check usage. For now, include them here or let children decide?
             Actually, NavTabs looks like it handles its own logic based on URL?
             Let's check NavTabs content first.
          */}
        <NavTabs />
        <Outlet context={{ trip }} />
      </main>
    </>
  );
}
