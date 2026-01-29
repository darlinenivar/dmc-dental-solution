// src/pages/Login.jsx
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmail } from "../lib/authSupabase";
import "../styles/login.css";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const canSubmit = useMemo(() => {
    return email.trim().length > 3 && password.trim().length >= 6 && !loading;
  }, [email, password, loading]);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signInWithEmail(email.trim(), password);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      console.error(err);
      setError(err?.message || "No se pudo iniciar sesión.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-brand">
          <div className="logo-badge">DMC</div>
          <div>
            <h1>DMC Dental Solution</h1>
            <p>Accede a tu consultorio</p>
          </div>
        </div>

        {error ? <div className="login-alert">{error}</div> : null}

        <form onSubmit={onSubmit} className="login-form">
          <label className="login-label">
            Email
            <input
              className="login-input"
              type="email"
              autoComplete="email"
              placeholder="ej: clínica@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          <label className="login-label">
            Contraseña
            <div className="login-pass">
              <input
                className="login-input"
                type={show ? "text" : "password"}
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="login-ghost"
                onClick={() => setShow((v) => !v)}
                aria-label="Mostrar contraseña"
              >
                {show ? "Ocultar" : "Ver"}
              </button>
            </div>
          </label>

          <button className="login-btn" disabled={!canSubmit}>
            {loading ? "Entrando..." : "Iniciar sesión"}
          </button>

          <div className="login-footer">
            <span className="hint">¿Olvidaste tu contraseña?</span>
            <span className="hint2">Luego agregamos “Recuperar contraseña”</span>
          </div>
        </form>
      </div>
    </div>
  );
}
