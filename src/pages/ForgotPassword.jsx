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
    } else {
      setMessage("Te enviamos un enlace a tu email.");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Recuperar contraseña</h2>

        <form onSubmit={handleReset}>
          <input
            type="email"
            placeholder="correo@clinica.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button type="submit">Enviar enlace</button>
        </form>

        {error && <p className="error">{error}</p>}
        {message && <p className="success">{message}</p>}

        <div className="auth-links">
          <Link to="/login">Volver a iniciar sesión</Link>
          <Link to="/register">Crear cuenta</Link>
        </div>
      </div>
    </div>
  );
}
