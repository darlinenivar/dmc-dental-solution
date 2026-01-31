import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import "../styles/auth.css";

export default function Register() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    // Si tu Supabase tiene "Email confirmations" encendido,
    // aquí saldrá mensaje de confirmar correo.
    if (!data.session) {
      setSuccess("Cuenta creada. Revisa tu email para confirmar y luego inicia sesión.");
      return;
    }

    // Si NO hay confirmación, entra directo:
    navigate("/dashboard", { replace: true });
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Crear cuenta</h1>
          <p>Registra tu cuenta para entrar al panel</p>
        </div>

        <form onSubmit={onSubmit} className="auth-form">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
            required
          />

          <label>Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="mínimo 6 caracteres"
            minLength={6}
            required
          />

          {error ? <div className="auth-error">{error}</div> : null}
          {success ? <div className="auth-success">{success}</div> : null}

          <button className="auth-btn" type="submit" disabled={loading}>
            {loading ? "Creando..." : "Crear cuenta"}
          </button>

          <div className="auth-links">
            <Link to="/login">Ya tengo cuenta</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
