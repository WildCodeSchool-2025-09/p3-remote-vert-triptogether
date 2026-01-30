import { useRef, useState } from "react";
import type { ChangeEventHandler, FormEventHandler } from "react";
import { useNavigate } from "react-router";

function Register() {
  const emailRef = useRef<HTMLInputElement>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handlePasswordChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    setPassword(event.target.value);
  };

  const handleConfirmPasswordChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    setConfirmPassword(event.target.value);
  };

  const handleSubmit: FormEventHandler = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users`,
        {
          method: "post",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
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
      <div>
        <label htmlFor="email">email</label>
        <input ref={emailRef} type="email" id="email" required />
      </div>
      <div>
        <label htmlFor="password">password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={handlePasswordChange}
          required
        />
        {password.length >= 8 ? "✅" : "❌"}
      </div>
      <div>
        <label htmlFor="confirm-password">confirm password</label>
        <input
          type="password"
          id="confirm-password"
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
          required
        />
        {password === confirmPassword && password !== "" ? "✅" : "❌"}
      </div>
      <button type="submit" disabled={password !== confirmPassword || password.length < 8}>
        Send
      </button>
    </form>
  );
}

// L'EXPORT DEFAULT EST ICI :
export default Register;