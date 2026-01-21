import React, { useEffect, useState } from "react";
import "../styles/Reset.css";
import "../styles/MyTrips.css";

export default function MyTrips() {
const [status, setStatus] = useState("en_cours");
const [trips, setTrips] = useState([]);

useEffect(() => {
    let url = "";
    if (status === "en_cours") {
        url = "http://localhost:3310/api/trip";
    } else if (status === "a_venir") {
        url = "http://localhost:3310/api/future";
    } else if (status === "passes") {
        url = "http://localhost:3310/api/past";
    }
fetch(url)
    .then((response) => response.json())
    .then((data) => setTrips(data))
    .catch((error) => console.error("Error fetching trips:", error));
}, [status]);

const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);}
    const formatDateStart = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}
  return( 


    <>
    <div className="mytripsheader">
        <h1>Mes voyages</h1>

        
        <input type="text" placeholder="Rechercher un voyage ..." />
</div>
<div className="tripstate">
    <button type="button" className={status === "en_cours" ? "active" : ""} onClick={()=> setStatus("en_cours")}>En cours</button>
    <button type="button" className={status === "a_venir" ? "active" : ""} onClick={()=> setStatus("a_venir")}>A venir</button>
    <button type="button" className={status === "passes" ? "active" : ""} onClick={()=> setStatus("passes")}> Passés</button>
</div>

<div className="tripcards">

    {trips.map((trip: any) => (
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
            <p><img src="/images/Icône localisation.png" alt="" /> {trip.description}</p>
            <p><img src="/images/Icône calendrier 1.png" alt="" /> {formatDateStart(trip.start_at)} - {formatDate(trip.end_at)}</p>
        </div>
        
        </div>
        
    ))}
</div>

    </>
  )
}