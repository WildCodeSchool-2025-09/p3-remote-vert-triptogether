import "./styles/Membres.css";
import Onglets from "../components/Onglet/Onglet";

function Membres() {
  return (
    <>
      <header>
        <nav>Trip Together</nav>
      </header>
      <main>
        <section id="trip-infos" className="card">
          {/* Composant trip infos */}
        </section>

        <Onglets />

        <section id="member-list">
          {
            //TODO liste des participants
          }
        </section>
      </main>
    </>
  );
}

export default Membres;
