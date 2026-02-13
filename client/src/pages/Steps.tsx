import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import AddStep from "../components/AddTrip";
import NavTabs from "../components/NavTabs";
import StepCard from "../components/StepCard";
import TripInfos from "../components/TripInfos";
import { useAuth } from "../contexts/AuthContext";
import type { Step, StepsResponse, TheTrip } from "../types/tripType";
import "./styles/Steps.css";
import { toast } from "react-toastify";

type RouteParams = {
  id: string;
};

function Steps() {
  const { id } = useParams<RouteParams>();
  const tripId = Number(id);
  const navigate = useNavigate();

  const [trip, setTrip] = useState<TheTrip | null>(null);
  const [steps, setSteps] = useState<Step[]>([]);
  const [memberCount, setMemberCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { auth } = useAuth();
  const currentUserId = auth?.user?.id || 0;
  const token = auth?.token || localStorage.getItem("token");

  const fetchSteps = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/trips/${tripId}/steps`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        },
      );

      const result: StepsResponse = await response.json();

      if (response.status === 400) {
        navigate("/", {
          state: {
            toast: { type: "error", message: "Requête invalide" },
          },
        });
        return;
      }

      if (response.status === 403) {
        navigate("/", {
          state: {
            toast: { type: "error", message: "Accès non autorisé" },
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
    } catch (err) {
      console.error("Erreur fetch steps:", err);
      setError("Impossible de charger les étapes");
    } finally {
      setLoading(false);
    }
  }, [tripId, token, navigate]);

  const fetchTrip = useCallback(async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/trips/${tripId}`,
      );

      if (!response.ok) {
        if (response.status === 401) {
          toast.error("Veuillez vous connecter pour accéder à ce voyage.");
          return;
        }
        throw new Error("Erreur chargement voyage");
      }

      const data = await response.json();
      setTrip(data);
    } catch (err) {
      console.error(err);
      toast.error("Impossible de charger le voyage");
    }
  }, [tripId]);

  useEffect(() => {
    if (!id || Number.isNaN(tripId)) {
      navigate("/", {
        state: {
          toast: { type: "error", message: "Voyage invalide" },
        },
      });
      return;
    }

    fetchTrip();
    fetchSteps();
  }, [id, tripId, fetchTrip, fetchSteps, navigate]);

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
          <TripInfos trip={trip} />
        </section>

        <NavTabs />

        <AddStep onStepAdded={fetchSteps} />

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
                    Pour valider une étape, tous les membres doivent avoir voté,
                    avec une majorité de OUI.
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
