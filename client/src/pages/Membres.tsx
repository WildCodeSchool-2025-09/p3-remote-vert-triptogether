import "./styles/Membres.css";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ToastContainer, toast } from "react-toastify";
import Onglets from "../components/Onglet/Onglet";

type InviteState = "en-attente" | "refusé" | "supprimé";

type MemberBase = {
  id: number;
  name: string;
  avatarUrl?: string | null;
  addedAt: string;
};

type Participant = MemberBase & {
  role: "organisateur" | "membre";
};

type Invite = MemberBase & {
  inviteState: InviteState;
  lastReminderAt?: string | null;
};

type ApiInvitation = {
  id: number;
  status: "pending" | "accepted" | "refused" | "removed";
  created_at: string;
  updated_at: string;
  creator_id: number;
  invited_id: number;
  trip_id: number;
  trip_title: string;
  trip_start: string;
  creator_firstname: string;
  creator_lastname: string;
  invited_firstname: string;
  invited_lastname: string;
};

type RouteParams = {
  id: string;
};

function Membres() {
  const { id } = useParams<RouteParams>();
  const tripId = Number(id);

  const [participants, setParticipants] = useState<Participant[]>([]);
  const [invites, setInvites] = useState<Invite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [memberToRemove, setMemberToRemove] = useState<Participant | null>(
    null,
  );
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

    fetch(`${import.meta.env.VITE_API_URL}/api/invitation/trip/${tripId}`)
      .then(async (response) => {
        const invitations:
          | ApiInvitation[]
          | { error?: string; message?: string } = await response.json();

        if (response.status === 400) {
          navigate("/", {
            state: {
              toast: {
                type: "error",
                message:
                  "error" in invitations && invitations.error
                    ? invitations.error
                    : "Requête invalide",
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

        if (!Array.isArray(invitations)) {
          setError("Données invitations invalides.");
          return;
        }

        const participantsList: Participant[] = [];

        if (invitations.length > 0) {
          const first = invitations[0];
          participantsList.push({
            id: first.creator_id,
            name: `${first.creator_firstname} ${first.creator_lastname}`,
            avatarUrl: null, // TODO: photo de profil
            addedAt: first.created_at,
            role: "organisateur",
          });
        }

        const acceptedInvitations = invitations.filter(
          (inv) => inv.status === "accepted",
        );

        for (const inv of acceptedInvitations) {
          participantsList.push({
            id: inv.invited_id,
            name: `${inv.invited_firstname} ${inv.invited_lastname}`,
            avatarUrl: null, // TODO: photo de profil
            addedAt: inv.updated_at || inv.created_at,
            role: "membre",
          });
        }

        const invitesList: Invite[] = invitations
          .filter(
            (inv) =>
              inv.status === "pending" ||
              inv.status === "refused" ||
              inv.status === "removed",
          )
          .map((inv) => ({
            id: inv.invited_id,
            name: `${inv.invited_firstname} ${inv.invited_lastname}`,
            avatarUrl: null, // TODO: photo de profil
            addedAt: inv.created_at,
            inviteState:
              inv.status === "refused"
                ? "refusé"
                : inv.status === "removed"
                  ? "supprimé"
                  : "en-attente",
            lastReminderAt: null,
          }));

        setParticipants(participantsList);
        setInvites(invitesList);
      })
      .catch((err) => {
        console.error("Erreur fetch membres:", err);
        setError("Impossible de charger les membres.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [tripId, navigate]);

  const removeParticipant = (userId: number) => {
    setIsRemoving(true);

    fetch(`${import.meta.env.VITE_API_URL}/api/trip/${tripId}/${userId}`, {
      method: "DELETE",
    })
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

        setParticipants((prev) =>
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

        <Onglets />

        {/* TODO Ajouter un membre : Autre US*/}

        <section id="member-list">
          {loading && <p>Chargement des membres...</p>}
          {error && <p className="error">{error}</p>}

          {!loading && !error && (
            <>
              <article>
                <h3>Participants ({participants.length})</h3>
                <ul>
                  {participants.map((member) => (
                    <li key={`${member.role}-${member.id}`}>
                      <div className="left-side">
                        <div className="avatar">
                          {member.avatarUrl ? (
                            <img src={member.avatarUrl} alt={member.name} />
                          ) : (
                            <span className="avatar-initial">
                              {member.name.charAt(0)}
                            </span>
                          )}
                        </div>
                        <div>
                          <p className="name">{member.name}</p>
                          <p className="date">
                            Ajouté le{" "}
                            {new Date(member.addedAt).toLocaleDateString(
                              "fr-FR",
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="right-side">
                        {member.role === "organisateur" ? (
                          <span className="badge badge-organisateur">
                            Organisateur
                          </span>
                        ) : (
                          <button
                            type="button"
                            className="btn-role"
                            onClick={() => setMemberToRemove(member)}
                          >
                            Retirer
                          </button>
                        )}
                      </div>
                      {memberToRemove && (
                        <div className="modal-backdrop">
                          <div className="modal">
                            <h4>Retirer ce membre ?</h4>
                            <p>
                              Voulez-vous vraiment retirer{" "}
                              <strong>{memberToRemove.name}</strong> de ce
                              voyage ?
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
                                onClick={() =>
                                  removeParticipant(memberToRemove.id)
                                }
                                disabled={isRemoving}
                              >
                                {isRemoving
                                  ? "Suppression..."
                                  : "Confirmer le retrait"}
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </article>

              <article>
                <h3>Invité·e·s ({invites.length})</h3>
                <ul>
                  {invites.map((member) => (
                    <li key={member.id}>
                      <div className="left-side">
                        <div className="avatar avatar-empty">
                          <span>👤</span>
                        </div>
                        <div>
                          <p className="name">{member.name}</p>
                          <p className="date">
                            Ajouté le{" "}
                            {new Date(member.addedAt).toLocaleDateString(
                              "fr-FR",
                            )}
                          </p>
                          {member.lastReminderAt && (
                            <p className="date date-small">
                              Relancé le{" "}
                              {new Date(
                                member.lastReminderAt,
                              ).toLocaleDateString("fr-FR")}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="right-side">
                        {member.inviteState === "refusé" ? (
                          <>
                            <span className="badge badge-refuse">Refusé</span>
                            <button type="button" className="btn-danger">
                              Supprimer
                            </button>
                            {/* Dans une autre US gérer les suppression*/}
                          </>
                        ) : (
                          <>
                            <span className="badge badge-pending">
                              En Attente
                            </span>
                            <button type="button" className="btn-primary">
                              Relancer
                              {/* Dans une autre US gérer les relances*/}
                            </button>
                          </>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </article>
            </>
          )}
        </section>
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

export default Membres;
