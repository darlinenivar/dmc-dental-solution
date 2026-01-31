import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    });

    if (error) {
      setError(error.message);
      return;
    }

    setMessage("Te enviamos un enlace a tu correo.");
  };

  return (
    <div className="auth-container">
      <form className="auth-card" onSubmit={handleReset}>
        <h2>Recuperar contraseña</h2>

        {error && <p className="auth-error">{error}</p>}
        {message && <p className="auth-success">{message}</p>}

        <input
          type="email"
          placeholder="correo@clinica.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button type="submit" className="btn-primary">
          Enviar enlace
        </button>

        <div className="auth-links">
          <Link to="/login">Volver a iniciar sesión</Link>
          <Link to="/register">Crear cuenta</Link>
        </div>
      </form>
    </div>
  );
}
