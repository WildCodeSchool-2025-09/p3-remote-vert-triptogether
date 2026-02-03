import { useState } from "react";
import { useParams } from "react-router";
import "./styles/TripInvitation.css";
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
      if (response.ok) {
        const data = await response.json();
        console.log("Invitation envoyée avec succès :", data);
      }
      toast.success("Invitation envoyée avec succès");
      setInvitationForm({ email: "", message: "" });
    } catch (err) {
      toast.error("Erreur lors de l'envoi");
      console.error(err);
    }
  };

  return (
    <>
      <header>
        <nav className="tripinvitation-navbar">
          <ul className="tripinvitation-navbar-list">
            <li>
              {" "}
              <img src="../../public/logo.png" alt="" width={50} />
              <h1 className="tripinvitation-title">Trip Together</h1>
            </li>
            <li> Mes voyages</li>
            <li>
              <button type="button" className="tripinvitation-btn-navbar">
                {" "}
                C'est parti !
              </button>
              <img src="../../public/profile-pic-logo.png" alt="" width={50} />
            </li>
          </ul>
        </nav>
      </header>

      <main className="tripinvitation-main">
        <ToastContainer
          position="top-right"
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
        <section className="tripinvitation-invitation-form">
          <article className="tripinvitation-head">
            <p>
              <img src="../../public/letter-picture.png" alt="" width={80} />
              Inviter un participant
            </p>
            <p>Invitez une personne à rejoindre ce voyage par email</p>
          </article>
          <article className="tripinvitation-bg-image" />
          <article className="tripinvitation-trip-infos">
            <h2 className="tripinvitation-trip-infos-title">Été à Barcelone</h2>
            <p>15 juillet -23 août 2026</p>
            <p>2 participants</p>
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
                placeholder="janedoe@outlook.com"
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
            >
              Envoyer l'invitation
            </button>
            <button
              type="button"
              className="tripinvitation-btn-cancel-invitation"
              onClick={cancelInvitation}
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

export default ContactForm;
