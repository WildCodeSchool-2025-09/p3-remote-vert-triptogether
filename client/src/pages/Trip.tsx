import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ToastContainer, toast } from "react-toastify";
import Modal from "../components/Modal";
import NavTabs from "../components/NavTabs/NavTabs";
import { useToast } from "../hooks/useToast";
import TripCard from "./TripCard";
import TripInvitation from "./TripInvitation";
import "./styles/Trip.css";

type Trip = {
  tripId: number;
  title: string;
  city: string;
  country: string;
  start_at: string;
  end_at: string;
  participants: number;
  status: "pending" | "accepted" | "refused";
  role: "organizer" | "participant";
};

export function Trip() {
  type RouteParams = {
    id: string;
  };

  const { id } = useParams<RouteParams>();
  const tripId = Number(id);
  const [trip, setTrip] = useState<Trip | null>(null);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  const navigate = useNavigate();
  useToast();
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
  }, [tripId, navigate]);

  const openInviteModal = () => {
    setIsInviteModalOpen(true);
  };

  const closeInviteModal = () => {
    setIsInviteModalOpen(false);
  };

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/trips/${id}`)
      .then((res) => res.json())
      .then((data) => setTrip(data))
      .catch(() => {
        toast.error("Impossible de charger le voyage");
      });
  }, [id]);
  console.log(trip);
  return (
    <>
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
      <header>
        <nav className="trip-navbar">Trip Together</nav>
      </header>
      <main>
        <section className="trip-trip-infos">
          <article className="trip-tripinfocard">
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
                onInvite={openInviteModal}
              />
            )}
          </article>
        </section>

        <NavTabs />
      </main>
      <Modal isOpen={isInviteModalOpen} onClose={closeInviteModal}>
        {trip && (
          <TripInvitation
            tripId={tripId}
            title={trip.title}
            city={trip.city}
            country={trip.country}
            startAt={trip.start_at}
            endAt={trip.end_at}
            participants={trip.participants}
            onClose={closeInviteModal}
          />
        )}
      </Modal>
    </>
  );
}
