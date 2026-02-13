import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import "./styles/invitation.css";
import BudgetCard from "../components/BudgetCard";
import ParticipantsCard from "../components/ParticipantsCard";
import TripInfos from "../components/TripInfos";
import type { invitationType } from "../types/invitationType";
import type { Trip } from "../types/tripType";

function Invitation() {
  const { id, invitationId } = useParams<{
    id: string;
    invitationId: string;
  }>();
  const [invitation, setInvitation] = useState<invitationType | null>(null);
  const [mytrip, setmyTrip] = useState<Trip | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!invitationId) {
      navigate("/", {
        state: {
          toast: {
            type: "error",
            message: "Invitation invalide",
          },
        },
      });
    }

    fetch(`${import.meta.env.VITE_API_URL}/api/trips/${id}`)

      .then(async (response) => {
        if (!response.ok) {
          if (response.status === 401) {
            toast.error("Veuillez vous connecter pour accéder à ce voyage.");
            return;
          }
          throw new Error("Erreur chargement voyage");
        }
        const data = await response.json();
        setmyTrip(data);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Impossible de charger le voyage");
      });

    fetch(`${import.meta.env.VITE_API_URL}/api/invitation/${invitationId}`)
      .then(async (response) => {
        const invitation = await response.json();

        if (response.status === 400) {
          navigate("/", {
            state: {
              toast: {
                type: "error",
                message: invitation.message,
              },
            },
          });
        }

        if (response.status === 403) {
          navigate("/", {
            state: {
              toast: {
                type: "error",
                message: invitation.message,
              },
            },
          });
        }

        if (response.status === 404) {
          navigate("/", {
            state: {
              toast: {
                type: "error",
                message: invitation.message,
              },
            },
          });
        }

        if (response.status === 409) {
          navigate(`/trip/${invitation.trip_id}`, {
            state: {
              toast: {
                type: "error",
                message: invitation.message,
              },
            },
          });
        }

        if (response.status === 410) {
          navigate("/", {
            state: {
              toast: {
                type: "error",
                message: invitation.message,
              },
            },
          });
        }

        setInvitation(invitation);
      })
      .catch(() => {
        navigate("/", {
          state: {
            toast: {
              type: "error",
              message: "Invitation introuvable ou accès non autorisé",
            },
          },
        });
      });
  }, [navigate, invitationId, id]);

  async function invitationResponded(status: "accepted" | "refused") {
    if (!invitationId) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/invitation/${invitationId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      if (status === "accepted") {
        navigate(`/trip/${id ?? invitation?.trip_id}`, {
          state: {
            toast: {
              type: "success",
              message: "Invitation acceptée",
            },
          },
        });
      } else {
        navigate("/", {
          state: {
            toast: {
              type: "error",
              message: "Invitation refusée",
            },
          },
        });
      }
    } catch (err) {
      toast.error("Erreur lors du traitement de l'invitation");
    }
  }

  return (
    <>
      <TripInfos trip={mytrip} />
      <main className="invitation-main">
        <section className="invitation-other-informations">
          <BudgetCard />

          <ParticipantsCard />
        </section>
        <article id="invitation" className="invitation-card">
          <p className="invitation-text">Vous avez été invité·e par</p>
          <img
            src="/mini-profile-pic.png"
            alt={invitation?.creator_firstname}
            className="invitation-avatar"
          />
          <p className="invitation-inviter-name">
            {`${invitation?.creator_firstname ?? ""} ${
              invitation?.creator_lastname ?? ""
            }`}
          </p>
          <p>"{invitation?.message}"</p>

          <div className="invitation-actions">
            <button
              type="button"
              className="invitation-btn-primary"
              onClick={() => invitationResponded("accepted")}
            >
              Accepter
            </button>
            <button
              type="button"
              className="invitation-btn-outline"
              onClick={() => invitationResponded("refused")}
            >
              Refuser
            </button>
          </div>
        </article>
      </main>
    </>
  );
}

export default Invitation;
