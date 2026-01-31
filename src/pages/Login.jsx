// src/pages/Login.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import "../styles/auth.css";

export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error: err } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (err) {
      setError(err.message);
      return;
    }

    nav("/dashboard", { replace: true });
  };

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-left">
          <h2 className="auth-title">DMC Dental Solution</h2>
          <p className="auth-subtitle">Accede a tu clínica de forma segura</p>
          <ul style={{ margin: 0, paddingLeft: 18, color: "#334155" }}>
            <li>Acceso seguro con Supabase</li>
            <li>Multi-clínica real</li>
            <li>Diseño premium + rápido</li>
          </ul>
        </div>

        <div className="auth-right">
          <h2 className="auth-title">Iniciar sesión</h2>
          <p className="auth-subtitle">Bienvenido/a, ingresa tus credenciales</p>

          <form className="auth-form" onSubmit={onSubmit}>
            <label>Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="tu@email.com"
              required
            />

            <div style={{ height: 10 }} />

            <label>Contraseña</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="••••••••"
              required
            />

            {error && <div className="auth-error">{error}</div>}

            <button className="auth-btn" type="submit" disabled={loading}>
              {loading ? "Ingresando..." : "Iniciar sesión"}
            </button>
          </form>

          <div className="auth-links">
            <Link to="/forgot-password">¿Olvidaste tu contraseña?</Link>
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
