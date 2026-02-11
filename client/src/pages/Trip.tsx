import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ToastContainer, toast } from "react-toastify";
import Modal from "../components/Modal";
import NavTabs from "../components/NavTabs/NavTabs";
import TripInfos from "../components/TripInfos/TripInfos";
import { useToast } from "../hooks/useToast";
import TripCard from "./TripCard";
import TripInvitation from "./TripInvitations";
import "./styles/Trip.css";
import type { Trip as TripType } from "../types/tripType";

export function Trip() {
  type RouteParams = {
    id: string;
  };

  const { id } = useParams<RouteParams>();
  const tripId = Number(id);
  const [trip, setTrip] = useState<TripType | null>(null);
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

    fetch(`${import.meta.env.VITE_API_URL}/api/trips/info/${tripId}`)
      .then(async (response) => {
        if (!response.ok) {
          if (response.status === 401) {
            toast.error("Veuillez vous connecter pour accéder à ce voyage.");
            return;
          }
          throw new Error("Erreur chargement voyage");
        }
        const data = await response.json();
        setTrip(data);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Impossible de charger le voyage");
      });
  }, [tripId, navigate]);

  const openInviteModal = () => {
    setIsInviteModalOpen(true);
  };

  const closeInviteModal = () => {
    setIsInviteModalOpen(false);
  };
  console.log(trip);
  return (
    <>
      
      <TripInfos trip={trip} />
      <main className="page">
        <NavTabs />
        <div className="trip-dashboard">
          <h2>Tableau de bord</h2>
          <p>Bienvenue sur le récapitulatif de votre voyage.</p>
        </div>
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
