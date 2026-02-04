import "./styles/TripCard.css";

type TripCardProps = {
  title?: string;
  city?: string;
  country?: string;
  startAt: string;
  endAt: string;
  participants?: number;
  status?: "pending" | "accepted" | "refused";
  role?: "organizer" | "participant";
};

function TripCard({
  title,
  city,
  country,
  startAt,
  endAt,
  participants,
  status,
  role,
}: TripCardProps) {
  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(new Date(dateString));
  };

  return (
    <article className="trip-card">
      <h2 className="trip-card-title">{title}</h2>
      <p className="trip-card-location">
        {city}, {country}
      </p>

      <p className="trip-card-dates">
        {formatDate(startAt)} - {formatDate(endAt)}
      </p>
      <p className="trip-card-participants">{participants} participant(s)</p>
      <p className="trip-card-status">{status}</p>
      <p className="trip-card-role">{role}</p>
    </article>
  );
}
export default TripCard;
