import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { ToastContainer, toast } from "react-toastify";
import TripCard from "./TripCard";

import "./styles/Invitation.css";
import "./styles/TripInvitation.css";

type InvitationForm = {
  email: string;
  message: string;
};

type Trip = {
  id: number;
  title: string;
  city: string;
  country: string;
  start_at: string;
  end_at: string;
  participants: number;
  status: "pending" | "accepted" | "refused";
  role: "organizer" | "participant";
};

function TripInvitation() {
  const { id } = useParams<{ id: string }>();

  const [invitationForm, setInvitationForm] = useState<InvitationForm>({
    email: "",
    message: "",
  });

  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(false);

  // 🔹 Récupération des infos du voyage
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/trips/${id}`)
      .then((res) => res.json())
      .then((data) => setTrip(data))
      .catch(() => {
        toast.error("Impossible de charger le voyage");
      });
  }, [id]);

  // 🔹 Mise à jour des champs du formulaire
  const updateInvitationForm = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setInvitationForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 🔹 Reset formulaire
  const cancelInvitation = () => {
    setInvitationForm({ email: "", message: "" });
  };

  // 🔹 Fonction dédiée pour copier le lien
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Lien d’invitation copié 📋");
    } catch {
      toast.error("Impossible de copier le lien");
    }
  };

  // 🔹 Envoi de l’invitation
  const sendInvitation = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/trips/${id}/invitations`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(invitationForm),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de l'envoi");
      }

      // 👉 Copie du vrai lien renvoyé par l’API
      await copyToClipboard(data.invitationLink);

      setInvitationForm({ email: "", message: "" });
    } catch {
      toast.error("Erreur lors de l'envoi de l'invitation");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/trips/${id}`)
      .then((response) => response.json())
      .then((data) => setTrip(data));
  }, [id]);

  return (
    <>
      <nav className="tripinvitation-navbar">
        <ul className="tripinvitation-navbar-list">
          <li>
            <img src="../../public/logo.png" alt="Trip Together" width={50} />
            <h1 className="tripinvitation-title">Trip Together</h1>
          </li>
          <li>Mes voyages</li>
          <li>
            <button type="button" className="tripinvitation-btn-navbar">
              C&apos;est parti !
            </button>
            <img
              src="../../public/profile-pic-logo.png"
              alt="Profil"
              width={50}
            />
          </li>
        </ul>
      </nav>

      <main className="tripinvitation-main">
        <section className="tripinvitation-invitation-form">
          <ToastContainer position="top-right" autoClose={5000} theme="light" />

          <article className="tripinvitation-head">
            <p>
              <img src="../../public/letter-picture.png" alt="" width={80} />
              Inviter un participant
            </p>
            <p>Invitez une personne à rejoindre ce voyage par email</p>
          </article>

          <article className="tripinvitation-bg-image" />

          <article className="tripinvitation-trip-infos">
            {trip && (
              <TripCard
                title={trip.title}
                city={trip.city}
                country={trip.country}
                startAt={trip.start_at}
                endAt={trip.end_at}
                participants={trip.participants}
                status={trip.status}
                role={trip.role}
              />
            )}
          </article>

          <form
            onSubmit={sendInvitation}
            className="tripinvitation-form-inputs"
          >
            <label className="tripinvitation-email-form">
              Adresse email*
              <input
                type="email"
                name="email"
                value={invitationForm.email}
                onChange={updateInvitationForm}
                required
                placeholder="janedoe@caramail.com"
              />
            </label>

            <label className="tripinvitation-message-form">
              Message
              <textarea
                name="message"
                value={invitationForm.message}
                onChange={updateInvitationForm}
                required
                placeholder="Type your message here"
              />
            </label>

            <button
              type="submit"
              className="tripinvitation-btn-send-invitation"
              disabled={loading}
            >
              {loading ? "Envoi..." : "Envoyer l'invitation"}
            </button>

            <button
              type="button"
              className="tripinvitation-btn-cancel-invitation"
              onClick={cancelInvitation}
              disabled={loading}
            >
              Annuler
            </button>
          </form>
        </section>

        <footer />
      </main>
    </>
  );
}

export default TripInvitation;
