//import { useEffect, useState } from "react";
//import { useParams } from "react-router";

function Invitation() {
  /*  

  const [invitation, setInvitation] = useState([]);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/invitation/${id}`)
      .then((response) => response.json())
      .then((data) => setInvitation(data));
  }, []);
*/
  return (
    <main>
      <header>Trip Together</header>

      <section>
        <img src="cover.jpg" alt="" />
      </section>

      <section>
        <h1>Eté à Barcelone</h1>
        <p>Ville, Pays</p>
        <p>15 Juillet - 23 Aout 2025</p>
        <p>2 participants</p>
      </section>

      <section>
        <h1>Budget</h1>

        <h1>Participants</h1>
        <p>2 membres</p>
        <img src="npc.jpg" alt="" />
        <img src="npc.jpg" alt="" />
      </section>

      <section>
        <p>
          Vous avez été invité·es <br />
          par
          <img src="npc3.jpg" alt="" /> <br />
          <strong>Marie Dupont</strong>
        </p>
        <button type="button">Accepter</button>
        <button type="button">Refuser</button>
      </section>
    </main>
  );
}

export default Invitation;
