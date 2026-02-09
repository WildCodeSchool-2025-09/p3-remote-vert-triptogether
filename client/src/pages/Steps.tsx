import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router";
import type { Trip } from "../types/tripType";
import NavTabs from "../components/NavTabs/NavTabs";
import AddStep from "../components/Step/AddTrip";
import StepCard from "../components/Step/StepCard";
import { useAuth } from "../contexts/AuthContext";
import type { Step } from "../types/voteType";
import "./styles/Step.css";

type RouteParams = {
  id: string;
};

type StepsResponse =
  | {
      trip: Trip;
      steps: Step[];
    }
  | { error?: string; message?: string };

function Steps() {
  const { id } = useParams<RouteParams>();
  const tripId = Number(id);
  const [trip, setTrip] = useState<Trip | null>(null);
  const [steps, setSteps] = useState<Step[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { auth } = useAuth();
  const currentUserId = auth?.user?.id || 0;

  const fetchSteps = useCallback(() => {
    if (!id || Number.isNaN(tripId)) return;

    const token = auth?.token || localStorage.getItem("token");

    setLoading(true);
    setError(null);

    fetch(`${import.meta.env.VITE_API_URL}/api/trips/${tripId}/steps`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    })
      .then(async (response) => {
        const result: StepsResponse = await response.json();

        if (response.status === 400) {
          setError("Requête invalide");
          return;
        }

        if (response.status === 403 || response.status === 401) {
          setError("Accès non autorisé");
          return;
        }

        if (!("steps" in result)) {
          setError("Données d'étapes invalides");

          return;
        }

        setSteps(result.steps);
        if ("trip" in result) {
          setTrip(result.trip);
        }
      })
      .catch((err) => {
        console.error("Ereur fetch steps:", err);
        setError("Impossible de charger les étapes");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [auth?.token, id, tripId]);

  useEffect(() => {
    fetchSteps();
  }, [fetchSteps]);
  const mainDestination = steps.find(
    (step) => trip && step.city === trip.city && step.country === trip.country,
  );
  const proposeDestination = steps.filter(
    (step) => step.id !== mainDestination?.id,
  );
  return (
    <>
      <header>
        <nav>Trip Together</nav>
      </header>
      <main>
        <section id="trip-infos" className="card" />

        <NavTabs />

        <AddStep onStepAdded={fetchSteps} />

        <section id="steps-list">
          {loading && <p>Chargement des étapes...</p>}
          {error && <p className="error">{error}</p>}

          {!loading && !error && (
            <div>
              {steps.length === 0 ? (
                <p>Aucune étape pour le moment</p>
              ) : (
                <div>
                  {mainDestination && (
                    <>
                      <h1>Destination principale</h1>
                      <StepCard
                        key={mainDestination.id}
                        step={mainDestination}
                        currentUserId={currentUserId}
                        tripId={tripId}
                        isMainDestination={true}
                      />
                    </>
                  )}
                  <div className="steps-container">
                    <h1> Propositions d'étapes</h1>
                    {proposeDestination.map((step) => (
                      <StepCard
                        key={step.id}
                        step={step}
                        currentUserId={currentUserId}
                        tripId={tripId}
                        isMainDestination={false}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </section>
      </main>
    </>
  );
}
export default Steps;
