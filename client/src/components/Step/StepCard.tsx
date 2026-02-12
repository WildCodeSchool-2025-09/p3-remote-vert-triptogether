import { useEffect, useState } from "react";
import type { StepCardProps } from "../../types/tripType";
import type { CreateVotePayload, Vote, VotesStats } from "../../types/voteType";
import "./StepCard.css";

function StepCard({ step, currentUserId, tripId, memberCount }: StepCardProps) {
  const [allVotes, setAllVotes] = useState<Vote[]>([]);
  const [loading, setLoading] = useState(true);
  const [alreadyVoted, setAlreadyVoted] = useState(false);
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showVotes, setShowVotes] = useState(false);

  const stepImage = `https://www.sourcesplash.com/i/random?q=city&id=${step.id}`;
  const thumbsUpLogo = (
    <img src="/logos/green-thumb.png" className="green-thumb" alt="Oui" />
  );
  const thumbsDownLogo = (
    <img src="/logos/brown-thumb.png" className="brown-thumb" alt="Non" />
  );

  useEffect(() => {
    loadVotes();
  }, []);

  const loadVotes = () => {
    setLoading(true);
    setError(null);

    fetch(
      `${import.meta.env.VITE_API_URL}/api/trips/${tripId}/steps/${step.id}/votes`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      },
    )
      .then(async (response) => {
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error || "Erreur lors de la récupération des votes",
          );
        }
        const data: VotesStats = await response.json();

        setAllVotes(data.allVotes);
        setError(null);
      })
      .catch((err) => {
        console.error("Erreur fetch votes:", err);
        setError(err instanceof Error ? err.message : "Erreur de chargement");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleVote = (voteValue: boolean) => {
    setAlreadyVoted(true);
    setError(null);

    const createVoteData: CreateVotePayload = {
      user_id: currentUserId,
      vote: voteValue,
      comment: comment.trim() || undefined,
    };

    fetch(
      `${import.meta.env.VITE_API_URL}/api/trips/${tripId}/steps/${step.id}/votes`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(createVoteData),
      },
    )
      .then(async (response) => {
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Erreur lors du vote");
        }

        window.location.reload();
      })
      .catch((err) => {
        console.error("Erreur lors du vote:", err);
        setError(err instanceof Error ? err.message : "Erreur lors du vote");
      })
      .finally(() => {
        setAlreadyVoted(false);
      });
  };

  const userVote = allVotes.find((v) => v.user_id === currentUserId);
  const hasVoted = Boolean(userVote);
  const yesVotes = step.voteStats?.yes ?? 0;
  const noVotes = step.voteStats?.no ?? 0;
  const totalVotes = yesVotes + noVotes;
  const yesPercentage = totalVotes === 0 ? 0 : (yesVotes / totalVotes) * 100;

  return (
    <div className="step-card">
      <img src={stepImage} alt={`Vue de ${step.city}`} />
      <article className="step-header">
        <h2>{step.city}</h2>
        <h3>{step.country}</h3>
        <h3 id="step-header-end">Proposée par </h3>
        {/* ajouter {step.creator_name} */}
      </article>
      <article className="step-body">
        <div className="vote-progress">
          <div className="vote-stats">
            <span className="stat-value yes">
              {thumbsUpLogo} {yesVotes}
            </span>
            <span className="stat-value no">
              {thumbsDownLogo} {noVotes}
            </span>
          </div>
          <div className="vote-bar">
            <div
              className="vote-bar-yes"
              style={{ width: `${yesPercentage}%` }}
            />
          </div>
        </div>
        {allVotes && allVotes.length > 0 ? (
          <div className="all-votes-section">
            <button
              type="button"
              onClick={() => setShowVotes(!showVotes)}
              className="toggle-votes-btn"
            >
              {showVotes ? "▲ Masquer" : "▼ Voir"} tous les votes (
              {allVotes.length} / {memberCount})
            </button>
            {showVotes && (
              <div className="votes-list">
                {allVotes.map((vote) => (
                  <div
                    key={vote.id}
                    className={`vote-item ${vote.vote ? "vote-yes-item" : "vote-no-item"}`}
                  >
                    <div className="vote-content">
                      <p className="vote-user">
                        {vote.user_name}
                        <span className="vote-value">
                          {vote.vote ? thumbsUpLogo : thumbsDownLogo}
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
        ) : (
          <div className="no-votes-placeholder">
            <p className="toggle-votes-btn">En attente d'un vote</p>
          </div>
        )}
        {error && <p className="error">{error}</p>}
        {loading ? (
          <p className="loading-text">Chargement</p>
        ) : !hasVoted ? (
          <div className="vote-section">
            <div className="vote-buttons">
              <button
                type="button"
                onClick={() => handleVote(true)}
                disabled={alreadyVoted}
                className="vote-btn vote-yes"
              >
                {alreadyVoted ? (
                  "Envoi..."
                ) : (
                  <span className="vote-yes-btn">{thumbsUpLogo} OUI</span>
                )}
              </button>
              <button
                type="button"
                onClick={() => handleVote(false)}
                disabled={alreadyVoted}
                className="vote-btn vote-no"
              >
                {alreadyVoted ? (
                  "Envoi..."
                ) : (
                  <span className="vote-no-btn">{thumbsDownLogo} NON</span>
                )}
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
              {userVote?.vote ? (
                <span className="voted-yes">{thumbsUpLogo} Voté OUI</span>
              ) : (
                <span className="voted-no">{thumbsDownLogo} Voté NON</span>
              )}
            </p>
            {userVote?.comment && (
              <p className="voted-comment">"{userVote.comment}"</p>
            )}
          </div>
        )}
      </article>
    </div>
  );
}

export default StepCard;
