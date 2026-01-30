import "./styles/invitation.css";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ToastContainer, toast } from "react-toastify";
import Guests from "../components/Guests/Guests";
import NavTabs from "../components/NavTabs/NavTabs";
import type { Guest, invitationType } from "../types/invitationType";

type RouteParams = {
  id: string;
};

type Invitations =
  | {
      trip: {
        id: number;
        title: string;
        description: string;
        start_at: string;
        end_at: string;
        user_id: number;
        owner_firstname?: string;
        owner_lastname?: string;
      };
      invitations: invitationType[];
    }
  | { error?: string; message?: string };

function Invitations() {
  const { id } = useParams<RouteParams>();
  const tripId = Number(id);

  const [attendees, setAttendees] = useState<Guest[]>([]);
  const [otherInvitations, setOtherInvitations] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [memberToRemove, setMemberToRemove] = useState<Guest | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!tripId) {
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

    fetch(`${import.meta.env.VITE_API_URL}/api/trips/${tripId}/invitations`)
      .then(async (response) => {
        const result: Invitations = await response.json();

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

        if (!("trip" in result)) {
          setError("Données invitations invalides.");
          return;
        }

        const { trip, invitations } = result;

        const creator: Guest = {
          id: trip.user_id,
          name: `${trip.owner_firstname} ${trip.owner_lastname}`,
          avatarUrl: null,
          addedAt: trip.start_at,
          role: "organisateur",
        };

        const acceptedInvitations = invitations.filter(
          (invitation) => invitation.status === "accepted",
        );

        const acceptedGuests: Guest[] = acceptedInvitations.map((inv) => ({
          id: inv.user_id,
          name: `${inv.invited_firstname} ${inv.invited_lastname}`,
          avatarUrl: null,
          addedAt: inv.created_at,
          role: "membre",
        }));

        const attendees: Guest[] = [creator, ...acceptedGuests];

        const otherInvitations: Guest[] = invitations
          .filter((invitation) => invitation.status !== "accepted")
          .map((inv) => ({
            id: inv.user_id,
            name: `${inv.invited_firstname} ${inv.invited_lastname}`,
            avatarUrl: null,
            addedAt: inv.created_at,
            inviteState: inv.status === "refused" ? "refuse" : "en-attente",
            lastReminderAt: null,
          }));

        setAttendees(attendees);
        setOtherInvitations(otherInvitations);
      })
      .catch((err) => {
        console.error("Erreur fetch invitations:", err);
        setError("Impossible de charger les invitations.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [tripId, navigate]);

  const removeParticipant = (userId: number) => {
    if (!tripId) return;

    setIsRemoving(true);

    fetch(
      `${import.meta.env.VITE_API_URL}/api/invitation/${tripId}/${userId}`,
      {
        method: "DELETE",
      },
    )
      .then(async (response) => {
        if (response.status === 400) {
          toast.error("Requête invalide");
          return;
        }

        if (response.status === 403) {
          toast.error("Accès non autorisé");
          return;
        }

        if (response.status === 404) {
          toast.error("Membre introuvable");
          return;
        }

        if (!response.ok) {
          toast.error("Erreur serveur.");
          return;
        }

        setAttendees((prev) =>
          prev.filter((participant) => participant.id !== userId),
        );

        toast.success("Membre retiré du voyage.");
      })
      .catch(() => {
        toast.error("Erreur serveur.");
      })
      .finally(() => {
        setIsRemoving(false);
        setMemberToRemove(null);
      });
  };

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

        <section id="member-list">
          {loading && <p>Chargement des membres...</p>}
          {error && <p className="error">{error}</p>}

          {!loading && !error && (
            <>
              <Guests
                title="Participants"
                invited={attendees}
                type="attendees"
                remove={setMemberToRemove}
              />
              <Guests
                title="Invité·e·s"
                invited={otherInvitations}
                type="others"
              />
            </>
          )}
        </section>

        {memberToRemove && (
          <div className="modal-backdrop">
            <div className="modal">
              <h4>Retirer ce membre ?</h4>
              <p>
                Voulez-vous vraiment retirer{" "}
                <strong>{memberToRemove.name}</strong> de ce voyage ?
              </p>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-role"
                  onClick={() => setMemberToRemove(null)}
                  disabled={isRemoving}
                >
                  Annuler
                </button>
                <button
                  type="button"
                  className="btn-danger"
                  onClick={() => removeParticipant(memberToRemove.id)}
                  disabled={isRemoving}
                >
                  {isRemoving ? "Suppression..." : "Confirmer le retrait"}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}

export default Invitations;
