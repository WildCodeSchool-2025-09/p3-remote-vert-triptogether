type TripCardProps = {
  title: string;
  city: string;
  country: string;
  startAt: string;
  endAt: string;
  participantsCount: number;
  status: "pending" | "active" | "finished";
  role: "organizer" | "participant";
};

function TripCard({
  title,
  city,
  country,
  startAt,
  endAt,
  participantsCount,
  status,
  role,
}: TripCardProps) {
  return (
    <article className="trip-card">
      <div className="trip-badges">
        <span>{status === "active" ? "En cours" : "À venir"}</span>
        {role === "organizer" && <span>Organisateur</span>}
      </div>

      <h2>{title}</h2>

      <p>
        📍 {city}, {country}
      </p>
      <p>
        📅 {startAt} – {endAt}
      </p>
      <p>👥 {participantsCount} participants</p>
    </article>
  );
}

export default TripCard;
