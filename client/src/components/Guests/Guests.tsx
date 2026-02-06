import type { Guest } from "../../types/invitationType";
import "./Guests.css";

type GuestsProps =
  | {
      title: string;
      invited: Guest[];
      type: "attendees";
    }
  | {
      title: string;
      invited: Guest[];
      type: "others";
    };

function Guests(props: GuestsProps) {
  const { title, invited } = props;

  return (
    <article className="guests-article">
      <h3>
        {title} ({invited.length})
      </h3>
      <ul>
        {invited.map((member) => (
          <li key={member.id}>
            <div className="left-side">
              <div
                className={
                  props.type === "others" ? "avatar avatar-empty" : "avatar"
                }
              >
                {member.avatarUrl ? (
                  <img src={member.avatarUrl} alt={member.name} />
                ) : props.type === "others" ? (
                  <span>👤</span>
                ) : (
                  <span className="avatar-initial">
                    {member.name.charAt(0)}
                  </span>
                )}
              </div>
              <div>
                <p className="name">{member.name}</p>
                <p className="date">
                  Ajouté le{" "}
                  {new Date(member.addedAt).toLocaleDateString("fr-FR")}
                </p>
                {member.lastReminderAt && (
                  <p className="date date-small">
                    Relancé le{" "}
                    {new Date(member.lastReminderAt).toLocaleDateString(
                      "fr-FR",
                    )}
                  </p>
                )}
              </div>
            </div>

            <div className="right-side">
              {props.type === "attendees" ? (
                member.role === "organisateur" ? (
                  <span className="badge badge-organisateur">Organisateur</span>
                ) : (
                  <button type="button" className="btn-role">
                    Membre
                  </button>
                )
              ) : member.inviteState === "refuse" ? (
                <>
                  <span className="badge badge-refuse">Refusé</span>
                  <button type="button" className="btn-danger">
                    Supprimer
                  </button>
                </>
              ) : (
                <>
                  <span className="badge badge-pending">En Attente</span>
                  <button type="button" className="btn-primary">
                    Relancer
                  </button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </article>
  );
}

export default Guests;
