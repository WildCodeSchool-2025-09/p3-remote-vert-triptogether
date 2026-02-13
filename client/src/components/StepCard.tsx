import { useCallback, useEffect, useState } from "react";
import type {
  CreateVotePayload,
  StepCardProps,
  VotesStats,
} from "../types/voteType";
import "../pages/styles/StepCard.css";

function StepCard({
  step,
  currentUserId,
  tripId,
  isMainDestination = false,
  trip,
}: StepCardProps) {
  const [votesData, setVotesData] = useState<VotesStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [alreadyVoted, setAlreadyVoted] = useState(false);
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showVotes, setShowVotes] = useState(false);

  const [startDate, setStartDate] = useState(
    trip?.start_at ? trip.start_at.split("T")[0] : "",
  );
  const [endDate, setEndDate] = useState(
    trip?.end_at ? trip.end_at.split("T")[0] : "",
  );

  const loadVotes = useCallback(() => {
    if (isMainDestination) return;
    setLoading(true);
    setError(null);

    fetch(
      `${import.meta.env.VITE_API_URL}/api/trips/${tripId}/steps/${step.id}/votes`,
    )
      .then(async (response) => {
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error || "Erreur lors de la récupération des votes",
          );
        }
        const data: VotesStats = await response.json();
        setVotesData(data);
        setError(null);
      })
      .catch((err) => {
        console.error("Erreur fetch votes:", err);
        setError(err instanceof Error ? err.message : "Erreur de chargement");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [step.id, tripId, isMainDestination]);

  useEffect(() => {
    loadVotes();
  }, [loadVotes]);

  useEffect(() => {
    if (trip?.start_at) setStartDate(trip.start_at.split("T")[0]);
    if (trip?.end_at) setEndDate(trip.end_at.split("T")[0]);
  }, [trip]);

  const handleVote = (voteValue: boolean) => {
    setAlreadyVoted(true);
    setError(null);

    const createVoteData: CreateVotePayload = {
      vote: voteValue,
      comment: comment.trim() || undefined,
    };

    fetch(
      `${import.meta.env.VITE_API_URL}/api/trips/${tripId}/steps/${step.id}/votes`,
      {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(createVoteData),
      },
    )
      .then(async (response) => {
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Erreur lors du vote");
        }

        loadVotes();
        setComment("");
      })
      .catch((err) => {
        console.error("Erreur lors du vote:", err);
        setError(err instanceof Error ? err.message : "Erreur lors du vote");
      })
      .finally(() => {
        setAlreadyVoted(false);
      });
  };

  const userVote = votesData?.allVotes.find((v) => v.user_id === currentUserId);
  const hasVoted = Boolean(userVote);

  return (
    <div className="tripcard">
      <article
        className="trip-image"
        style={{
          backgroundImage: `url(${step.image_url || "/images/villedefault.jpg"})`,
        }}
      >
        <h2>{step.city}</h2>
        <h3>{step.country}</h3>
      </article>
      <article className="trip-info">
        {!isMainDestination &&
          (votesData ? (
            <div className="vote-stats">
              <div className="stat-item">
                <span className="stat-value yes">
                  👍 {votesData.voteStats.yes}
                </span>
                <span className="stat-label">Oui</span>
              </div>
              <div className="stat-item">
                <span className="stat-value no">
                  👎 {votesData.voteStats.no}
                </span>
                <span className="stat-label">Non</span>
              </div>
              <div className="stat-total">
                {votesData.allVotes.length} vote(s)
              </div>
            </div>
          ) : null)}
        {error && <p className="error">{error}</p>}
        {!isMainDestination &&
          (loading ? (
            <p className="loading-text">Chargement...</p>
          ) : !hasVoted ? (
            <div className="vote-section">
              <h3>Votez pour cette étape</h3>
              <div className="vote-buttons">
                <button
                  type="button"
                  onClick={() => handleVote(true)}
                  disabled={alreadyVoted}
                  className="vote-btn vote-yes"
                >
                  {alreadyVoted ? "Envoi..." : "👍 Oui"}
                </button>
                <button
                  type="button"
                  onClick={() => handleVote(false)}
                  disabled={alreadyVoted}
                  className="vote-btn vote-no"
                >
                  {alreadyVoted ? "Envoi..." : "👎 Non"}
                </button>
              </div>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Commentaire (optionnel)"
                maxLength={500}
                disabled={alreadyVoted}
                className="vote-comment"
                rows={3}
              />
              <p className="comment-counter">{comment.length}/500 caractères</p>
            </div>
          ) : (
            <div className="voted-message">
              <p className="voted-text">
                ✅ Vous avez voté : {userVote?.vote ? "👍 Oui" : "👎 Non"}
              </p>
              {userVote?.comment && (
                <p className="voted-comment">"{userVote.comment}"</p>
              )}
            </div>
          ))}
        {votesData && votesData.allVotes.length > 0 && (
          <div className="all-votes-section">
            <button
              type="button"
              onClick={() => setShowVotes(!showVotes)}
              className="toggle-votes-btn"
            >
              {showVotes ? "▲ Masquer" : "▼ Voir"} tous les votes (
              {votesData.allVotes.length})
            </button>
            {showVotes && (
              <div className="votes-list">
                {votesData.allVotes.map((vote) => (
                  <div
                    key={vote.id}
                    className={`vote-item ${vote.vote ? "vote-yes-item" : "vote-no-item"}`}
                  >
                    <div className="vote-content">
                      <p className="vote-user">
                        {vote.user_name}
                        <span className="vote-value">
                          {vote.vote ? " 👍 Oui" : " 👎 Non"}
                        </span>
                      </p>
                      {vote.comment && (
                        <p className="vote-comment-text">"{vote.comment}"</p>
                      )}
                    </div>
                    <span className="vote-date">
                      {new Date(vote.created_at).toLocaleDateString("fr-FR")}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </article>
      {isMainDestination && (
        <div className="calendar-section">
          <div className="calendar-header">
            <span className="calendar-icon">📅</span>
            <span>Dates du séjour</span>
          </div>
          <div className="calendar-inputs">
            <div className="calendar-input-group">
              <label
                htmlFor={`start-date-${step.id}`}
                className="calendar-label"
              >
                Départ
              </label>
              <input
                type="date"
                id={`start-date-${step.id}`}
                className="calendar-date-input"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            <div className="calendar-separator">➜</div>
            <div className="calendar-input-group">
              <label htmlFor={`end-date-${step.id}`} className="calendar-label">
                Fin
              </label>
              <input
                type="date"
                id={`end-date-${step.id}`}
                className="calendar-date-input"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StepCard;
