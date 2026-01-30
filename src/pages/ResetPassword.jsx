import React, { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "../styles/auth.css";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  const [error, setError] = useState(null);

  async function onSubmit(e) {
    e.preventDefault();
    setMsg(null);
    setError(null);

    if (!email.trim()) return setError("Escribe tu correo.");

    setLoading(true);

    const redirectTo = `${window.location.origin}/update-password`;

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });

    setLoading(false);

    if (error) return setError(error.message);

    setMsg("Listo ✅ Revisa tu email. Te enviamos un enlace para cambiar tu contraseña.");
  }

  return (
    <div className="auth-page">
      <div className="auth-card auth-card-small">
        <div className="auth-right">
          <h2 className="auth-title">Recuperar contraseña</h2>
          <p className="auth-sub">Te enviaremos un enlace para crear una nueva contraseña.</p>

          {msg && <div className="msg">{msg}</div>}
          {error && <div className="msg error">{error}</div>}

          <form className="form" onSubmit={onSubmit}>
            <div>
              <label className="label">Email</label>
              <input
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                autoComplete="email"
              />
            </div>

            <button className="btn btn-primary" disabled={loading}>
              {loading ? "Enviando..." : "Enviar enlace"}
            </button>

            <div className="row" style={{ marginTop: 12 }}>
              <Link className="link" to="/login">Volver a login</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
