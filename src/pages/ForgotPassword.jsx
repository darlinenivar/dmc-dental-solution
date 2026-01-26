import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/auth.css";
import { resetPassword } from "../lib/auth";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setOk("");
    setLoading(true);
    try {
      await resetPassword(email.trim());
      setOk("Listo. Revisa tu correo para resetear la contraseña.");
    } catch (error) {
      setErr(error?.message || "No se pudo enviar el email.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <img src="/dmc-logo.png" alt="DMC" />
          <h1 className="auth-title">Recuperar contraseña</h1>
          <p className="auth-subtitle">Te enviaremos un enlace al correo.</p>
        </div>

        <form onSubmit={onSubmit}>
          <div className="auth-field">
            <label className="auth-label">Correo electrónico</label>
            <input
              className="auth-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
            />
          </div>

          {err ? <div className="auth-error">{err}</div> : null}
          {ok ? <div style={{ marginTop: 12, fontSize: 13, color: "#14532d", background: "#dcfce7", border: "1px solid #bbf7d0", padding: "10px 12px", borderRadius: 12 }}>{ok}</div> : null}

          <button className="auth-btn" disabled={loading}>
            {loading ? "Enviando..." : "Enviar enlace"}
          </button>

          <div className="auth-row" style={{ marginTop: 14 }}>
            <Link className="auth-link" to="/login">
              Volver al login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
