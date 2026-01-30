import { useState } from "react";
import "./styles/Invitation.css";
import { useParams } from "react-router";

type InvitationForm = {
  email: string;
  message: string;
};

function ContactForm() {
  const { id } = useParams<{ id: string }>();

  const [invitationForm, setInvitationForm] = useState<InvitationForm>({
    email: "",
    message: "",
  });

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
      if (response.ok) {
        const data = await response.json();
        console.log("Invitation envoyée avec succès :", data);
      }
    } catch (err) {
      console.error(err);
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
