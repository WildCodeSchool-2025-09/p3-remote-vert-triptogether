import { useEffect, useState } from "react";
import "./styles/Invitation.css";
import { useParams } from "react-router";
import { ToastContainer, toast } from "react-toastify";
import TripCard from "../components/TripCard";

type InvitationForm = {
  email: string;
  message: string;
};

type Trip = {
  title: string;
  city: string;
  country: string;
  start_at: string;
  end_at: string;
  participants_count: number;
  status: "pending" | "active" | "finished";
  role: "organizer" | "participant";
};

function ContactForm() {
  const { id } = useParams<{ id: string }>();

  const [invitationForm, setInvitationForm] = useState<InvitationForm>({
    email: "",
    message: "",
  });

  const [trip, setTrip] = useState<Trip | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchTrip = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/trips/${id}`,
        );

        if (!response.ok) {
          throw new Error("Erreur chargement voyage");
        }

        const data = await response.json();
        setTrip(data);
      } catch {
        toast.error("Impossible de charger le voyage");
      }
    };

    fetchTrip();
  }, [id]);

  const updateInvitationForm = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setInvitationForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const cancelInvitation = () => {
    setInvitationForm({ email: "", message: "" });
  };

  const sendInvitation = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/trips/${id}/invitations`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: invitationForm.email,
            message: invitationForm.message,
          }),
        },
      );
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message);
      }
      toast.success("Invitation envoyée avec succès");

      setInvitationForm({ email: "", message: "" });
    } catch (err) {
      toast.error("Erreur lors de l'envoi");
    }
  };

  return (
    <>
      <header>
        <nav>Inviter un participant</nav>
        <p>Invitez une personne à rejoindre ce voyage par email</p>
      </header>
      <section id="trip-infos" className="card">
        {/* Composant trip infos */}
      </section>
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
      <section className="trip-card-section">
        {trip && (
          <TripCard
            title={trip.title}
            city={trip.city}
            country={trip.country}
            startAt={trip.start_at}
            endAt={trip.end_at}
            participantsCount={trip.participants_count}
            status={trip.status}
            role={trip.role}
          />
        )}
      </section>

      <form onSubmit={sendInvitation}>
        <label>
          Email
          <input
            type="email"
            name="email"
            value={invitationForm.email}
            onChange={updateInvitationForm}
            required
          />
        </label>

        <label>
          Message
          <textarea
            name="message"
            value={invitationForm.message}
            onChange={updateInvitationForm}
            required
          />
        </label>
        <button
          type="button"
          className="btn btn-outline"
          onClick={cancelInvitation}
        >
          Annuler
        </button>
        <button type="submit" className="btn btn-primary">
          Envoyer l'invitation
        </button>
      </form>
    </>
  );
}

export default ContactForm;
