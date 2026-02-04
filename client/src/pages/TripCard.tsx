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
    <>
      <article className="tripcard-component">
        <h2 className="tripcard-title">{title}</h2>
        <p className="tripcard-location">
          {city}, {country}
        </p>
        <p className="tripcard-dates">
          {formatDate(startAt)} - {formatDate(endAt)}
        </p>
        <p className="tripcard-participants">{participants} participant(s)</p>
        <p className="tripcard-status">{status}</p>
        <p className="tripcard-role">{role}</p>
      </article>
    </>
  );
}

export default TripCard;
