// src/pages/ForgotPassword.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "../styles/auth.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!email.trim()) {
      setError("Escribe tu email.");
      return;
    }

    setLoading(true);
    try {
      const redirectTo = `${window.location.origin}/reset-password`;

      const { error: supaError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo,
      });

      if (supaError) throw supaError;

      setMessage("Listo ✅ Te enviamos un enlace a tu correo.");
    } catch (err) {
      setError(err?.message || "Error enviando el enlace.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Recuperar contraseña</h2>
        <p className="muted">Escribe tu email y te enviamos el enlace.</p>

        <form onSubmit={onSubmit} className="auth-form">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="correo@clinica.com"
            required
          />

          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? "Enviando..." : "Enviar enlace"}
          </button>
        </form>

        {error && <p className="alert error">{error}</p>}
        {message && <p className="alert success">{message}</p>}

        <div className="auth-links">
          <Link to="/login">Volver a iniciar sesión</Link>
          <Link to="/register">Crear cuenta</Link>
        </div>
      </div>
    </div>
  );
}
