import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "../styles/auth.css";

export default function UpdatePassword() {
  const nav = useNavigate();
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  const [error, setError] = useState(null);
  const [hasSession, setHasSession] = useState(false);

  useEffect(() => {
    // Supabase normalmente detecta la sesión desde el link del email
    (async () => {
      const { data } = await supabase.auth.getSession();
      setHasSession(Boolean(data?.session));
    })();
  }, []);

  async function onSubmit(e) {
    e.preventDefault();
    setMsg(null);
    setError(null);

    if (password.length < 6) return setError("La contraseña debe tener al menos 6 caracteres.");
    if (password !== password2) return setError("Las contraseñas no coinciden.");

    setLoading(true);

    const { error } = await supabase.auth.updateUser({ password });

    setLoading(false);

    if (error) return setError(error.message);

    setMsg("Contraseña actualizada ✅ Ya puedes iniciar sesión.");
    setTimeout(() => nav("/login", { replace: true }), 800);
  }

  return (
    <div className="auth-page">
      <div className="auth-card auth-card-small">
        <div className="auth-right">
          <h2 className="auth-title">Nueva contraseña</h2>

          {!hasSession && (
            <div className="msg error">
              Este enlace no tiene sesión activa. Abre nuevamente el enlace desde tu email o solicita uno nuevo.
              <div style={{ marginTop: 8 }}>
                <Link className="link" to="/reset-password">Solicitar nuevo enlace</Link>
              </div>
            </div>
          )}

          {msg && <div className="msg">{msg}</div>}
          {error && <div className="msg error">{error}</div>}

          <form className="form" onSubmit={onSubmit}>
            <div>
              <label className="label">Nueva contraseña</label>
              <input
                className="input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                autoComplete="new-password"
                disabled={!hasSession}
              />
            </div>

            <div>
              <label className="label">Repetir contraseña</label>
              <input
                className="input"
                type="password"
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
                placeholder="Repite la contraseña"
                autoComplete="new-password"
                disabled={!hasSession}
              />
            </div>

            <button className="btn btn-primary" disabled={loading || !hasSession}>
              {loading ? "Guardando..." : "Actualizar contraseña"}
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
