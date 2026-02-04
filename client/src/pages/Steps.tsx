import { useEffect, useState } from "react";
import StepCard from "../components/Step/StepCard";
import type { Step } from "../types/voteType";
import "./styles/Steps.css";
import { useNavigate, useParams } from "react-router";
import NavTabs from "../components/NavTabs/NavTabs";

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

  const navigate = useNavigate();

  // En attendant l'authentification :
  const currentUserId = 1;

  useEffect(() => {
    if (!id || Number.isNaN(tripId)) {
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

    setLoading(true);
    setError(null);

    fetch(`${import.meta.env.VITE_API_URL}/api/trips/${tripId}/steps`)
      .then(async (response) => {
        const result: StepsResponse = await response.json();

        if (response.status === 400) {
          navigate("/", {
            state: {
              toast: {
                type: "error",
                message: "Requête invalide",
              },
            },
          });
          return;
        }

        if (response.status === 403) {
          navigate("/", {
            state: {
              toast: {
                type: "error",
                message: "Accès non autorisé",
              },
            },
          });
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
  }, [id, tripId, navigate]);

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
