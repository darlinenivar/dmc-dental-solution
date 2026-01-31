// src/pages/ForgotPassword.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
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
    setLoading(true);

    // Importante: URL debe existir en Supabase Auth > URL Configuration
    const redirectTo = `${window.location.origin}/reset-password`;

    const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });

    setLoading(false);

    if (err) {
      setError(err.message);
      return;
    }

    setMessage("Listo. Te enviamos el enlace a tu correo.");
  };

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-left">
          <h2 className="auth-title">DMC Dental Solution</h2>
          <p className="auth-subtitle">Recuperación de acceso segura.</p>
          <p style={{ margin: 0, color: "#475569", fontSize: 13 }}>
            Escribe tu email y te enviamos el enlace para crear una nueva
            contraseña. El enlace abre en este mismo dominio.
          </p>
        </div>

        <div className="auth-right">
          <h2 className="auth-title">Recuperar contraseña</h2>
          <p className="auth-subtitle">Escribe tu email y te enviamos el enlace.</p>

          <form className="auth-form" onSubmit={onSubmit}>
            <label>Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="correo@clinica.com"
              required
            />

            {error && <div className="auth-error">{error}</div>}
            {message && <div className="auth-success">{message}</div>}

            <button className="auth-btn" type="submit" disabled={loading}>
              {loading ? "Enviando..." : "Enviar enlace"}
            </button>
          </form>

          <div className="auth-links">
            <Link to="/login">Volver a iniciar sesión</Link>
            <Link to="/register">Crear cuenta</Link>
          </div>

          <div style={{ marginTop: 16, fontSize: 12, color: "#64748b" }}>
            © {new Date().getFullYear()} DMC Dental Solution
          </div>
        </div>
      </div>
    </div>
  );
}
