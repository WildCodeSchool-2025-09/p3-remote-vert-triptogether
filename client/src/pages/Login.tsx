import { useRef } from "react";
import type { FormEventHandler } from "react";
import { Link, useNavigate } from "react-router";
import "./styles/Auth.css";

import { useAuth } from "../contexts/AuthContext";

function Login() {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const { setAuth } = useAuth();
  const navigate = useNavigate();

  const handleSubmit: FormEventHandler = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        {
          method: "post",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: emailRef.current?.value,
            password: passwordRef.current?.value,
          }),
        },
      );

      if (response.status === 200) {
        const data = await response.json();
        setAuth(data);
        localStorage.setItem("token", data.token);
        localStorage.setItem("auth", JSON.stringify(data));
        navigate("/");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="auth auth-page">
      <div className="auth-card">
        <div className="logo-container">
          <span className="logo-icon">🧳</span>
          <h1 className="logo-text">Trip Together</h1>
        </div>
        <h2 className="title">Bon retour parmi nous</h2>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              ref={emailRef}
              type="email"
              id="email"
              className="form-input"
              placeholder="Email"
              required
            />
          </div>
          <div className="input-group">
            <input
              ref={passwordRef}
              type="password"
              id="password"
              className="form-input"
              placeholder="Mot de passe"
              required
            />
          </div>

          <button type="submit" className="submit-btn">
            SE CONNECTER
          </button>
        </form>
        <div className="footer-login">
          Pas encore membre ? <Link to="/register">S'inscrire</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
