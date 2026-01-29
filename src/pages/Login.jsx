// src/pages/Login.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import "../styles/auth.css";

export default function Login() {
  const nav = useNavigate();
  const { signIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    const { error } = await signIn(email.trim(), password);
    setLoading(false);

    if (error) {
      setErr(error.message || "No se pudo iniciar sesión.");
      return;
    }

    nav("/dashboard");
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-left">
          <div className="brand">
            <div className="brand-badge">DMC</div>
            <div>
              <h1>DMC Dental Solution</h1>
              <p>Accede a tu consultorio • Multi-clínicas • Premium</p>
            </div>
          </div>

          <div className="features">
            <div className="feature">
              <div className="dot" />
              <div>Acceso seguro con Supabase Auth.</div>
            </div>
            <div className="feature">
              <div className="dot" />
              <div>Preparado para multi-clínicas y super admin.</div>
            </div>
            <div className="feature">
              <div className="dot" />
              <div>Diseño profesional (azul claro + gris azulado + blanco).</div>
            </div>
          </div>

          <div className="small">
            Tip: si tu usuario requiere confirmación por email, confirma primero y luego inicia sesión.
          </div>
        </div>

        <div className="auth-right">
          <h2 className="title">Iniciar sesión</h2>
          <p className="subtitle">Bienvenida, entra con tu correo y contraseña.</p>

          {err ? <div className="error">{err}</div> : null}

          <form className="form" onSubmit={onSubmit}>
            <div>
              <div className="label">Email</div>
              <input
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tuemail@dominio.com"
                autoComplete="email"
                required
              />
            </div>

            <div>
              <div className="label">Contraseña</div>
              <div style={{ display: "flex", gap: 10 }}>
                <input
                  className="input"
                  style={{ flex: 1 }}
                  type={show ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="btn"
                  style={{ width: 140, padding: "12px 10px" }}
                  onClick={() => setShow((s) => !s)}
                >
                  {show ? "Ocultar" : "Mostrar"}
                </button>
              </div>
            </div>

            <button className="btn" disabled={loading}>
              {loading ? "Entrando..." : "Iniciar sesión"}
            </button>

            <div className="linkrow">
              <Link className="a" to="/reset-password">¿Olvidaste tu contraseña?</Link>
              <Link className="a" to="/register">Crear usuario</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
