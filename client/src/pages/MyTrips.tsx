import { useEffect, useState } from "react";
import "./styles/MyTrips.css";
import "./styles/StepCard.css";
import { createPortal } from "react-dom";
import { Link, useNavigate } from "react-router";
import { toast } from "react-toastify";
import { useAuth } from "../contexts/AuthContext";

interface TheTrip {
  id: number;
  title: string;
  description: string;
  image_url: string;
  start_at: string;
  city: string;
  country: string;
  end_at: string;
}

export default function MyTrips() {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<
    "futur" | "current" | "past" | "all"
  >("all");

  const [trips, setTrips] = useState<TheTrip[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token") || auth?.token;
    if (!token) {
      toast.error("Vous devez être connecté pour voir vos voyages");
      navigate("/login");
    }

    fetch(
      `${import.meta.env.VITE_API_URL}/api/users/my-trips?status=${activeTab}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    )
      .then((res) => {
        if (!res.ok) throw new Error("Erreur lors de la récupération");
        return res.json();
      })
      .then((data) => setTrips(data))
      .catch((err) => console.error("Error fetching trips:", err));
  }, [activeTab, auth?.token, navigate]);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatDateStart = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  return (
    <>
      <div className="mytripsheader">
        <h1>Mes voyages</h1>
      </div>

      <div className="tripstate">
        <button
          type="button"
          className={activeTab === "all" ? "active" : ""}
          onClick={() => setActiveTab("all")}
        >
          Tous mes voyages
        </button>
        <button
          type="button"
          className={activeTab === "current" ? "active" : ""}
          onClick={() => setActiveTab("current")}
        >
          En cours
        </button>
        <button
          type="button"
          className={activeTab === "futur" ? "active" : ""}
          onClick={() => setActiveTab("futur")}
        >
          À venir
        </button>
        <button
          type="button"
          className={activeTab === "past" ? "active" : ""}
          onClick={() => setActiveTab("past")}
        >
          Passés
        </button>
      </div>

      <div className="tripcards">
        {trips.length > 0
          ? trips.map((trip) => (
              <Link
                to={`/trip/${trip.id}`}
                key={trip.id}
                className="tripcard-link"
              >
                <div className="tripcard">
                  <div
                    className="tripcard-image"
                    style={{
                      backgroundImage: `url(${trip.image_url ? trip.image_url : "/images/default-city.jpg"})`,
                    }}
                  >
                    <h2>{trip.title}</h2>
                  </div>
                  <div>
                    <div className="trip-info">
                      <p>
                        <img src="/images/location-icon.png" alt="" />
                        {trip.city}, {trip.country}
                      </p>
                      <p>
                        <img src="/images/calendar-icon.png" alt="" />
                        {formatDateStart(trip.start_at)} -{" "}
                        {formatDate(trip.end_at)}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          : createPortal(
              <p className="no-trips">
                Aucun voyage trouvé pour cette catégorie.
              </p>,
              document.body,
            )}
      </div>
    </>
  );
}
