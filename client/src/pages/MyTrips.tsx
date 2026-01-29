import { useEffect, useState } from "react";
import "../styles/Reset.css";
import "../styles/MyTrips.css";

interface Trip {
  id: number;
  title: string;
  description: string;
  image_url: string;
  start_at: string;
  end_at: string;
}

export default function MyTrips() {
  const [activeTab, setActiveTab] = useState<"futur" | "current" | "past">(
    "futur",
  );
  const [trips, setTrips] = useState([]);
  useEffect(() => {
    fetch(`http://localhost:3310/api/trips?status=${activeTab}`)
      .then((res) => res.json())
      .then((data) => setTrips(data))
      .catch((err) => console.error("Error fetching trips:", err));
  }, [activeTab]);

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

        <input type="text" placeholder="Rechercher un voyage ..." />
      </div>
      <div className="tripstate">
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
          A venir
        </button>
        <button
          type="button"
          className={activeTab === "past" ? "active" : ""}
          onClick={() => setActiveTab("past")}
        >
          {" "}
          Passés
        </button>
      </div>

      <div className="tripcards">
        {trips.map((trip: Trip) => (
          <div key={trip.id} className="tripcard">
            <div
              className="trip-image"
              style={{
                backgroundImage: `url(${trip.image_url ? trip.image_url : "/images/cacaland.jpg"})`,
              }}
            >
              <h2>{trip.title}</h2>
            </div>
            <div className="trip-info">
              <p>
                <img src="/images/Icône localisation.png" alt="" />{" "}
                {trip.description}
              </p>
              <p>
                <img src="/images/Icône calendrier 1.png" alt="" />{" "}
                {formatDateStart(trip.start_at)} - {formatDate(trip.end_at)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
