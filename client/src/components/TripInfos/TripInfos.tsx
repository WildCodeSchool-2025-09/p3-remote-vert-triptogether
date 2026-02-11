import type { Trip } from "../../types/tripType";
import "./TripInfos.css";
import { formatDate } from "../../utils/dateUtils";

type TripInfosProps = {
  trip: Trip | null;
};

function TripInfos({ trip }: TripInfosProps) {
  if (!trip) return null;

  return (
    <>
      <header
        className="trip-header"
        style={{
          backgroundImage: `url(${trip.image_url || "/images/villedefault.jpg"})`,
        }}
      >
        <div className="header-content">
          <h1>{trip.title}</h1>
          <p>{trip.description}</p>
        </div>
      </header>
      <section id="trip-infos" className="card">

      </section>
    </>
  );
}
export default TripInfos;
