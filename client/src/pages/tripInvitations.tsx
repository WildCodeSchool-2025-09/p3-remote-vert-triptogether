import { useState } from "react";
import "./styles/Invitation.css";
import { useParams } from "react-router";
import { ToastContainer, toast } from "react-toastify";

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
