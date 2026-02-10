import { useRef, useState } from "react";
import type { ChangeEventHandler, FormEventHandler } from "react";
import { useNavigate } from "react-router";

function Register() {
  const firstnameRef = useRef<HTMLInputElement>(null);
  const lastnameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handlePasswordChange: ChangeEventHandler<HTMLInputElement> = (
    event,
  ) => {
    setPassword(event.target.value);
  };

  const handleConfirmPasswordChange: ChangeEventHandler<HTMLInputElement> = (
    event,
  ) => {
    setConfirmPassword(event.target.value);
  };

  const handleSubmit: FormEventHandler = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/register`,
        {
          method: "post",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firstname: firstnameRef.current?.value,
            lastname: lastnameRef.current?.value,
            email: emailRef.current?.value,
            password,
          }),
        },
      );

      if (response.status === 201) {
        navigate("/login");
      } else {
        console.info(response);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="firstname">Prénom :</label>
      <br />
      <input ref={firstnameRef} type="text" id="firstname" required />
      <br />
      <br />
      <label htmlFor="lastname">Nom :</label>
      <br />
      <input ref={lastnameRef} type="text" id="lastname" required />
      <br />
      <br />
      <label htmlFor="email">Email : </label>
      <br />
      <input ref={emailRef} type="email" id="email" required />
      <br />
      <br />
      <label htmlFor="password">Mot de passe :</label>
      <br />
      <input
        type="password"
        id="password"
        value={password}
        onChange={handlePasswordChange}
        required
      />
      {password.length >= 8 ? "✅" : "❌"}
      <br />
      <br />
      <label htmlFor="confirm-password">Confirmer le mot de passe</label>
      <input
        type="password"
        id="confirm-password"
        value={confirmPassword}
        onChange={handleConfirmPasswordChange}
        required
      />
      {password === confirmPassword && password !== "" ? "✅" : "❌"}
      <br />
      <br />
      <button
        type="submit"
        disabled={password !== confirmPassword || password.length < 8}
      >
        S'enregistrer
      </button>
    </form>
  );
}

export default Register;
