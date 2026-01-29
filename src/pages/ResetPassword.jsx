// src/pages/ResetPassword.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import "../styles/auth.css";

export default function ResetPassword() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setOk("");
    setLoading(true);

    const redirectTo = `${window.location.origin}/update-password`;
    const { error } = await resetPassword(email.trim(), redirectTo);

    setLoading(false);

    if (error) {
      setErr(error.message || "No se pudo enviar el email.");
      return;
    }
    setOk("Listo. Te enviamos un correo para restablecer tu contraseña.");
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card" style={{ gridTemplateColumns: "1fr" }}>
        <div className="auth-right">
          <h2 className="title">Recuperar contraseña</h2>
          <p className="subtitle">Te enviaremos un enlace de recuperación.</p>

          {err ? <div className="error">{err}</div> : null}
          {ok ? <div className="ok">{ok}</div> : null}

          <form className="form" onSubmit={onSubmit}>
            <div>
              <div className="label">Email</div>
              <input className="input" value={email} onChange={(e)=>setEmail(e.target.value)} autoComplete="email" required />
            </div>

            <button className="btn" disabled={loading}>
              {loading ? "Enviando..." : "Enviar enlace"}
            </button>

            <div className="linkrow">
              <Link className="a" to="/login">Volver al login</Link>
              <Link className="a" to="/register">Crear usuario</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
