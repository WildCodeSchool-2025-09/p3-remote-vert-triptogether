import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ToastContainer, toast } from "react-toastify";
import "./styles/Invitation.css";
import type { invitationType } from "../types/invitationType";

function Invitation() {
  const { id } = useParams<{ id: string }>();
  const [invitation, setInvitation] = useState<invitationType | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (!id) {
      navigate("/", {
        state: {
          toast: {
            type: "error",
            message: "Invitation invalide",
          },
        },
      });
    }

    fetch(`${import.meta.env.VITE_API_URL}/api/invitation/${id}`)
      .then(async (response) => {
        const data = await response.json();

        if (response.status === 400) {
          navigate("/", {
            state: {
              toast: {
                type: "error",
                message: data.message,
              },
            },
          });
        }

        if (response.status === 403) {
          navigate("/", {
            state: {
              toast: {
                type: "error",
                message: data.message,
              },
            },
          });
        }

        if (response.status === 404) {
          navigate("/", {
            state: {
              toast: {
                type: "error",
                message: data.message,
              },
            },
          });
        }

        if (response.status === 409) {
          navigate(`/trip/${data.trip_id}`, {
            state: {
              toast: {
                type: "error",
                message: data.message,
              },
            },
          });
        }

        if (response.status === 410) {
          navigate("/", {
            state: {
              toast: {
                type: "error",
                message: data.message,
              },
            },
          });
        }

        setInvitation(data);
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
  }, [navigate, id]);

  async function invitationResponded(status: "accepted" | "refused") {
    if (!id) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/invitation/${id}`,
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
        navigate(`/trip/${invitation?.trip_id}`, {
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
      <header>
        <nav>Trip Together</nav>
      </header>
      <main>
        <section id="trip-infos" className="card">
          {/* Composant trip infos */}
        </section>
        <section className="other-informations">
          <article id="budget" className="card">
            {/* Composant budget autre US */}
          </article>

          <article id="participants" className="card">
            {/* Composant participants */}
          </article>
        </section>
        <article id="invitation" className="card invitation-card">
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
          <img src="npc3.jpg" alt="" className="inviter-avatar" />
          <p className="inviter-name">
            {`${invitation?.creator_firstname ?? ""} ${
              invitation?.creator_lastname ?? ""
            }`}
          </p>

          <div className="invitation-actions">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => invitationResponded("accepted")}
            >
              Accepter
            </button>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => invitationResponded("refused")}
            >
              Refuser
            </button>
          </div>
        </article>
        <footer>{/*footer */}</footer>
      </main>
    </>
  );
}

export default Invitation;
