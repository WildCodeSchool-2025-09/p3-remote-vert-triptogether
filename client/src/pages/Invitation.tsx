import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ToastContainer, toast } from "react-toastify";
import "./styles/Invitation.css";
import type { invitationType } from "../types/invitationType";

function Invitation() {
  const { id } = useParams<{ id: string }>();
  const [invitation, setInvitation] = useState<invitationType | null>(null);
  const [errorStatus, setErrorStatus] = useState<"error" | "success" | "null">(
    "null",
  );
  const [invitationStatus, setInvitationStatus] = useState<
    "accepted" | "refused" | "expired" | "null"
  >("null");
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) {
      setErrorStatus("error");
      setInvitationStatus("expired");
      return;
    }

    fetch(`${import.meta.env.VITE_API_URL}/api/invitation/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        return response.json() as Promise<invitationType>;
      })
      .then((data) => {
        setInvitation(data);
        setErrorStatus("null");

        if (data.status === "accepted" || data.status === "already_accepted") {
          toast.info("Invitation déjà acceptée");
          setInvitationStatus("accepted");
          setTimeout(() => navigate(`/trip/${data.trip_id}`), 3000);
          return;
        }

        if (data.status === "refused" || data.status === "already_refused") {
          toast.info("Invitation déjà refusée");
          setInvitationStatus("refused");
          setTimeout(() => navigate("/"), 3000);
          return;
        }

        setInvitationStatus("null");
      })
      .catch((err) => {
        console.error(err);
        setErrorStatus("error");
        setInvitationStatus("expired");
        toast.error("Invitation introuvable");
        setTimeout(() => navigate("/"), 3000);
      });
  }, [id, navigate]);

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

      setInvitationStatus(status);

      if (status === "accepted") {
        toast.success("Invitation acceptée");
        setTimeout(() => {
          navigate(`/trip/${invitation?.trip_id}`);
        }, 3000);
      } else {
        toast.error("Invitation refusée");
        setTimeout(() => {
          navigate("/");
        }, 3000);
      }
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors du traitement de l'invitation");
      setErrorStatus("error");
    }
  }

  if (
    !invitation &&
    (errorStatus === "error" || invitationStatus === "expired")
  ) {
    return (
      <main>
        <ToastContainer />
        <p>
          Invitation {id} introuvable, expirée ou tu n&apos;as pas accès à ce
          voyage. Tu vas être redirigé dans 3 secondes...
        </p>
      </main>
    );
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

          {invitationStatus === "null" && (
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
          )}

          {invitationStatus === "accepted" && (
            <p>Invitation acceptée, redirection dans 3 secondes...</p>
          )}
          {invitationStatus === "refused" && (
            <p>Invitation refusée, redirection dans 3 secondes...</p>
          )}
        </article>
        <footer>{/*footer */}</footer>
      </main>
    </>
  );
}

export default Invitation;
