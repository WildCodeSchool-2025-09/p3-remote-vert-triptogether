type TripCardProps = {
  title: string;
  city: string;
  country: string;
  start_at: string;
  end_at: string;
  participants: number;
  status: "pending" | "accepted" | "refused";
  role: "organizer" | "participants";
};

function TripCard({
  title,
  city,
  country,
  start_at,
  end_at,
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
          {formatDate(start_at)} - {formatDate(end_at)}
        </p>
        <p className="tripcard-participants">{participants} participants</p>
        <p className="tripcard-status">{status}</p>
        <p className="tripcard-role">{role}</p>
      </article>
    </>
  );
}

export default TripCard;
