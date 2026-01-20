import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ToastContainer, toast } from "react-toastify";
import "./invitation.css";

interface Invitation {
  id: number;
  status: string;
  trip_id: number;
  creator_id: number;
  invited_id: number;
  trip_title?: string;
  creator_firstname?: string;
  creator_lastname?: string;
  invited_firstname?: string;
  invited_lastname?: string;
}

type InvitationErrorBody = {
  error: string;
  trip_id?: number;
};

type InvitationResponseBody = Invitation | InvitationErrorBody | null;

function Invitation() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [status, setStatus] = useState<
    "success" | "refused" | "expired" | "error" | "loading" | "null"
  >("null");
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) {
      setStatus("error");
      return;
    }

    setStatus("loading");

    fetch(`${import.meta.env.VITE_API_URL}/api/invitation/${id}`)
      .then(async (response) => {
        const text = await response.text();

        let body: InvitationResponseBody = null;

        try {
          body = text
            ? (JSON.parse(text) as Invitation | InvitationErrorBody)
            : null;
        } catch {
          console.log("pas du json");
        }

        if (!response.ok) {
          const errorBody = (body || {}) as InvitationErrorBody;

          if (
            response.status === 400 &&
            errorBody.error === "Invitation déjà accepté"
          ) {
            const tripId = Number(errorBody.trip_id);

            if (tripId) {
              toast.info(
                "Invitation déjà acceptée, redirection vers le voyage...",
              );
              navigate(`/trip/${tripId}`);
            } else {
              navigate("/");
            }

            setStatus("success");
            return;
          }

          if (
            response.status === 400 &&
            errorBody.error === "Invitation expirée"
          ) {
            setStatus("expired");
            navigate("/");
          }

          setStatus("error");
          return;
        }

        const voyage = body as Invitation;
        setInvitation(voyage);
        if (voyage.status === "accepted") setStatus("success");
        else if (voyage.status === "refused") setStatus("refused");
        else setStatus("null");
      })
      .catch((err) => {
        console.error("ERREUR :", err);
        setStatus("error");
      });
  }, [id, navigate]);

  async function invitationAccepted() {
    if (!id || !invitation) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/invitation/${id}/accepted`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
        },
      );
      if (!response.ok) throw new Error("Erreur accept");
      toast.success("OK TU AS ACCEPTÉ ! WELCOME BRO");
      setStatus("success");
      navigate(`/trip/${invitation.trip_id}`);
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de l'acceptation");
    }
  }

  async function invitationRefused() {
    if (!id || !invitation) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/invitation/${id}/refused`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
        },
      );
      if (!response.ok) throw new Error("Erreur refus");
      toast.error("MAIS WHAT POURQUOI ???? TU VA NOUS MANQUER BRO !!!");
      setStatus("refused");
      navigate("/");
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors du refus");
    }
  }

  if (status === "loading") {
    return (
      <main>
        <ToastContainer />
        <p>Chargement de l'invitation...</p>
      </main>
    );
  }

  if (status === "error" || !invitation) {
    return (
      <main>
        <ToastContainer />
        <p>Invitation {id} introuvable ou tu n'as pas accès à ce voyage.</p>
      </main>
    );
  }

  return (
    <>
      <header>
        <nav>Trip Together</nav>
      </header>
      <main>
        <article id="trip-infos" className="card">
          {
            // Composant trip infos
          }
        </article>
        <section className="other-informations">
          <article id="budget" className="card">
            {
              // Composant budget autre US
            }
          </article>

          <article id="participants" className="card">
            {
              // Composant participants
            }
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
            {`${invitation.creator_firstname} ${invitation.creator_lastname}`}
          </p>

          {status === "null" && (
            <div className="invitation-actions">
              <button
                type="button"
                className="btn btn-primary"
                onClick={invitationAccepted}
              >
                Accepter
              </button>
              <button
                type="button"
                className="btn btn-outline"
                onClick={invitationRefused}
              >
                Refuser
              </button>
            </div>
          )}

          {status === "success" && <p>Invitation acceptée.</p>}
          {status === "refused" && <p>Invitation refusée.</p>}
        </article>
        <footer>{/*footer */}</footer>
      </main>
    </>
  );
}

export default Invitation;
