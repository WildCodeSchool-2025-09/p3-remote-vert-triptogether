import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import NavTabs from "../components/NavTabs";
import TripInfos from "../components/TripInfos";
import { useToast } from "../hooks/useToast";
import "./styles/Trip.css";
import StepCard from "../components/StepCard";
import type { Step, TheTrip } from "../types/tripType";

function Trip() {
  type RouteParams = {
    id: string;
  };

  const { id } = useParams<RouteParams>();
  const tripId = Number(id);
  const [steps, setSteps] = useState<Step[]>([]);
  const [memberCount, setMemberCount] = useState(0);
  const [myTrip, setMyTrip] = useState<TheTrip | null>(null);

  const navigate = useNavigate();
  useToast();

  const currentUserId = 1;

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
        setMyTrip(data);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Impossible de charger le voyage");
      });

    fetch(`${import.meta.env.VITE_API_URL}/api/trips/${tripId}/steps`)
      .then(async (response) => {
        if (!response.ok) {
          if (response.status === 401) {
            toast.error("Veuillez vous connecter pour accéder à ce voyage.");
            return;
          }
          throw new Error("Erreur chargement voyage");
        }
        const data = await response.json();
        setSteps(data.steps);
        setMemberCount(data.trip.memberCount);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Impossible de charger le voyage");
      });
  }, [tripId, navigate]);

  const validatedSteps = steps.filter((s) => s.status === "validated");

  return (
    <>
      <header>
        <nav>Trip Together</nav>
      </header>
      <main className="page">
        <section id="trip-infos" className="card">
          <TripInfos trip={myTrip} />
        </section>
        <NavTabs />
        <section className="steps-section">
          <h2 className="section-title">Récapitulatif du voyage</h2>
          <p className="section-subtitle">
            Voici les étapes validées par les membres
          </p>
          <section className="steps-container">
            {validatedSteps.map((step) => (
              <StepCard
                key={step.id}
                step={step}
                currentUserId={currentUserId}
                tripId={tripId}
                memberCount={memberCount}
              />
            ))}
          </section>
        </section>
      </main>
    </>
  );
}

export default Trip;
