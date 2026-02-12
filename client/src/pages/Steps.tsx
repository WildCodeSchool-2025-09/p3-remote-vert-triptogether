import { useEffect, useState } from "react";
import StepCard from "../components/Step/StepCard";
import type { Step, StepsResponse } from "../types/tripType";
import "./styles/Steps.css";
import { useNavigate, useParams } from "react-router";
import NavTabs from "../components/NavTabs/NavTabs";

type RouteParams = {
  id: string;
};

function Steps() {
  const { id } = useParams<RouteParams>();
  const tripId = Number(id);
  const navigate = useNavigate();

  const [steps, setSteps] = useState<Step[]>([]);
  const [memberCount, setMemberCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        setMemberCount(result.trip.memberCount);
      })
      .catch((err) => {
        console.error("Ereur fetch steps:", err);
        setError("Impossible de charger les étapes");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id, tripId, navigate]);

  const pendingSteps = steps.filter((s) => s.status === "pending");
  const validatedSteps = steps.filter((s) => s.status === "validated");
  const rejectedSteps = steps.filter((s) => s.status === "rejected");

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

        <section className="steps-list">
          {loading && <p className="loading-text">Chargement des étapes</p>}
          {error && <p className="error">{error}</p>}

          {!loading && !error && (
            <>
              {pendingSteps.length > 0 && (
                <div className="steps-section">
                  <h2 className="section-title">
                    Étapes en attente du vote des membres ({pendingSteps.length}
                    )
                  </h2>
                  <p className="section-subtitle">
                    Votez pour les destinations ci-dessous. <br />
                    Pour valider une étape, tous les membres du voyages doivent
                    avoir votés, avec une majorité de vote OUI.
                  </p>
                  <div className="steps-container">
                    {pendingSteps.map((step) => (
                      <StepCard
                        key={step.id}
                        step={step}
                        currentUserId={currentUserId}
                        tripId={tripId}
                        memberCount={memberCount}
                      />
                    ))}
                  </div>
                </div>
              )}

              {validatedSteps.length > 0 && (
                <div className="steps-section validated-section">
                  <h2 className="section-title">
                    Étapes validées ({validatedSteps.length})
                  </h2>
                  <p className="section-subtitle">
                    Ces étapes ont été approuvées par la majorité.
                  </p>
                  <div className="steps-container">
                    {validatedSteps.map((step) => (
                      <StepCard
                        key={step.id}
                        step={step}
                        currentUserId={currentUserId}
                        tripId={tripId}
                        memberCount={memberCount}
                      />
                    ))}
                  </div>
                </div>
              )}

              {rejectedSteps.length > 0 && (
                <div className="steps-section rejected-section">
                  <h2 className="section-title">
                    Étapes rejetées ({rejectedSteps.length})
                  </h2>
                  <p className="section-subtitle">
                    Ces étapes n'ont pas obtenu la majorité.
                  </p>
                  <div className="steps-container">
                    {rejectedSteps.map((step) => (
                      <StepCard
                        key={step.id}
                        step={step}
                        currentUserId={currentUserId}
                        tripId={tripId}
                        memberCount={memberCount}
                      />
                    ))}
                  </div>
                </div>
              )}

              {steps.length === 0 && (
                <p className="no-steps">Aucune étape pour le moment</p>
              )}
            </>
          )}
        </section>
      </main>
    </>
  );
}
export default Steps;
