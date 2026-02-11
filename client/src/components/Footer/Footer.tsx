import "./Footer.css";

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer-container">
      <hr className="footer-divider" />
      <article className="footer-content">
        <div className="footer-left">
          <img
            src="/logos/logo.png"
            alt="Trip Together logo"
            className="footer-logo"
          />
          Trip Together
        </div>
        <div className="footer-right">
          &copy; {year} TripTogether.{" "}
          <span className="footer-heart">
            Fait avec coeur pour les voyageurs.
          </span>
        </div>
      </article>
    </footer>
  );
}

export default Footer;
