import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "../styles/app.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || "/dashboard";

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);

    if (error) return setErr(error.message);

    navigate(redirectTo, { replace: true });
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <h1>Iniciar sesión</h1>
        <p className="muted">Accede al panel de tu clínica.</p>

        <form onSubmit={onSubmit} className="auth-form">
          <label>
            Email
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
          </label>

          <label>
            Contraseña
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />
          </label>

          {err ? <div className="error">{err}</div> : null}

          <button disabled={loading} className="btn">
            {loading ? "Entrando…" : "Iniciar sesión"}
          </button>
        </form>

        <div className="small">
          <a href="/politicas-privacidad">Política de Privacidad</a>
        </div>
      </div>
    </div>
  );
}
