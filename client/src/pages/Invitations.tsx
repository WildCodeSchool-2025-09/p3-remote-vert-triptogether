import "./styles/invitation.css";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import Guests from "../components/Guests/Guests";
import NavTabs from "../components/navTabs/NavTabs";
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
              />
              <Guests
                title="Invité·e·s"
                invited={otherInvitations}
                type="others"
              />
            </>
          )}
        </section>
      </main>
    </>
  );
}

export default Invitations;
