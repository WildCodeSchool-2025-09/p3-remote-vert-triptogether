import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ToastContainer, toast } from "react-toastify";
import "./styles/invitation.css";
import TripInfos from "../components/TripInfos/TripInfos";
import type { invitationType } from "../types/invitationType";
import type { Trip } from "../types/tripType";

function Invitation() {
  const { tripId, invitationId } = useParams<{
    tripId: string;
    invitationId: string;
  }>();
  const [invitation, setInvitation] = useState<invitationType | null>(null);

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
  }, [navigate, invitationId]);

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
        navigate(`/trip/${tripId ?? invitation?.trip_id}`, {
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

  const tripForInfos: Trip | null = invitation
    ? {
        id: invitation.trip_id,
        title: invitation.trip_title || "Voyage",
        description: "",
        city: "",
        country: "",
        start_at: invitation.trip_start,
        end_at: "",
        user_id: invitation.user_id,
      }
    : null;

  return (
    <>
      <header className="invitation-header">
        <nav className="invitation-navbar">Trip Together</nav>
      </header>
      <main className="invitation-main">
        <section id="trip-infos" className="invitation-card">
          <TripInfos trip={tripForInfos} />
        </section>
        <section className="invitation-other-informations">
          <article id="budget" className="invitation-card">
            {/* Composant budget autre US */}
          </article>

          <article id="participants" className="invitation-card">
            {/* Composant participants */}
          </article>
        </section>
        <article id="invitation" className="invitation-card">
          <ToastContainer
            position="top-center"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick={false}
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
          <p className="invitation-text">Vous avez été invité·e par</p>
          <img src="npc3.jpg" alt="" className="invitation-avatar" />
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
