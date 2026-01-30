import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import { supabase } from "../supabaseClient";

export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  const [err, setErr] = useState(null);

  async function onSubmit(e) {
    e.preventDefault();
    setErr(null);
    setMsg(null);
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    setLoading(false);

    if (error) {
      setErr(error.message);
      return;
    }

    nav("/dashboard");
  }

  return (
    <AuthLayout
      title="Iniciar sesión"
      subtitle="Accede a tu consultorio con seguridad."
    >
      {err && <div className="alert alertError">{err}</div>}
      {msg && <div className="alert alertOk">{msg}</div>}

      <form className="form" onSubmit={onSubmit}>
        <div>
          <label className="label">Email</label>
          <input
            className="input"
            type="email"
            placeholder="tuemail@clinica.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </div>

        <div>
          <label className="label">Contraseña</label>
          <input
            className="input"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </div>

        <div className="actions">
          <button className="btn btnPrimary" type="submit" disabled={loading}>
            {loading ? "Entrando..." : "Iniciar sesión"}
          </button>

          <Link className="smallLink" to="/reset-password">
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        <div className="actions" style={{ justifyContent: "flex-start" }}>
          <Link className="btn btnGhost" to="/register">
            Crear usuario
          </Link>
        </div>

        <div className="footerNote">
          Si eres <b>super admin</b>, podrás crear usuarios y asignarlos a clínicas.
        </div>
      </form>
    </AuthLayout>
  );
}
