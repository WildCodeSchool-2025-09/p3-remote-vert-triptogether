import { useRef } from "react";
import type { FormEventHandler } from "react";
import { useNavigate } from "react-router";

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
        `${import.meta.env.VITE_API_URL}/api/login`,
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
    <form onSubmit={handleSubmit}>
      <input ref={emailRef} type="email" placeholder="Email" required />
      <input
        ref={passwordRef}
        type="password"
        placeholder="Password"
        required
      />
      <button type="submit">Send</button>
    </form>
  );
}

export default Login;
