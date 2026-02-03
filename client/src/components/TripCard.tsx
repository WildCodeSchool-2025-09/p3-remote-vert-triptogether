type TripCardProps = {
  title: string;
  city: string;
  country: string;
  startAt: string;
  endAt: string;
  participants: number;
  status: "pending" | "accepted" | "refused";
  role: "organizer" | "participant";
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
  return (
    <article className="trip-card">
      <h2 className="trip-card-title">{title}</h2>
      <p className="trip-card-location">
        {city}, {country}
      </p>
      <p className="trip-card-dates">
        {startAt} - {endAt}
      </p>
      <p className="trip-card-participants">{participants}</p>
      <p className="trip-card-status">{status}</p>
      <p className="trip-card-role">{role}</p>
    </article>
  );
}
export default TripCard;
