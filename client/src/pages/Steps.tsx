import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router";
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
      trip: {
        id: number;
        title: string;
        description: string;
      };
      steps: Step[];
    }
  | { error?: string; message?: string };

function Steps() {
  const { id } = useParams<RouteParams>();
  const tripId = Number(id);

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

  return (
    <>
      <header>
        <nav>Trip Together</nav>
      </header>
      <main>
        <section id="trip-infos" className="card">
          {/* Composant trip infos */}
        </section>

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
                <div className="steps-container">
                  {steps.map((step) => (
                    <StepCard
                      key={step.id}
                      step={step}
                      currentUserId={currentUserId}
                      tripId={tripId}
                    />
                  ))}
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
