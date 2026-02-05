import { useEffect, useState } from "react";
import StepCard from "../components/Step/StepCard";
import AddStep from "../components/Step/AddTrip";
import { useAuth } from "../contexts/AuthContext";
import type { Step } from "../types/voteType";
import "./styles/Step.css";
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

function Steps () {
  const { id } = useParams<RouteParams>();
  const tripId = Number(id);

  const [steps, setSteps] = useState<Step[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  /* const currentUserId = 1; */
  const { auth } = useAuth();
  const currentUserId = auth?.user?.id || 0;

  const fetchSteps = () => {
    if (!id || Number.isNaN(tripId)) return;
    
    // Retrieve token (try localStorage if auth is null)
    const token = auth?.token || localStorage.getItem("token");

    setLoading(true);
    setError(null);

    fetch(`${import.meta.env.VITE_API_URL}/api/trips/${tripId}/steps`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // Add Authorization header if needed (StepActions.selectStepsByTrip might require it now?)
        // The router says: router.get("/:tripId/steps", StepActions.selectStepsByTrip); 
        // selectStepsByTrip has: const userId = req.body.user_id || 1; AND if (!userId) => 403.
        // But GET requests don't have a body usually.
        // Wait, selectStepsByTrip in stepActions.ts reads req.body.user_id ???
        // GET requests should read from query params or auth token.
        // If selectStepsByTrip expects body, calling it via GET is problematic if it relies on body.
        // However, looking at stepActions.ts:
        // const userId = req.body.user_id || 1;
        // This is weird for a GET request.
        // I should probably fix the server to take userId from req.auth (token) if available.
        // For now, let's send Authorization header.
        Authorization: token ? `Bearer ${token}` : "",
      }
    })
      .then(async (response) => {
        const result: StepsResponse = await response.json();

        if (response.status === 400) {
          setError("Requête invalide");
          return;
        }

        if (response.status === 403 || response.status === 401) {
             // If 403/401, maybe try to show empty list if public?
             // But the error says "Non authentifié".
             // The user reported 401. 
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
  };

  useEffect(() => {
    fetchSteps();
  }, [tripId, navigate]);

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