import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "../styles/auth.css";

export default function Login() {
  const nav = useNavigate();
  const rememberedEmail = useMemo(() => localStorage.getItem("remember_email") || "", []);

  const [email, setEmail] = useState(rememberedEmail);
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(Boolean(rememberedEmail));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // si ya está logueado, manda al dashboard
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (data?.session) nav("/dashboard", { replace: true });
    })();
  }, [nav]);

  async function onSubmit(e) {
    e.preventDefault();
    setError(null);

    if (!email.trim()) return setError("Escribe tu correo.");
    if (!password) return setError("Escribe tu contraseña.");

    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    // Remember me (solo email)
    if (remember) localStorage.setItem("remember_email", email);
    else localStorage.removeItem("remember_email");

    nav("/dashboard", { replace: true });
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* LEFT (branding) */}
        <div className="auth-left">
          <div className="brand">
            {/* Si tienes logo real, ponlo en /public/logo.png */}
            <div className="brand-logo">
              <img
                src="/logo.png"
                alt="DMC Dental Solution"
                onError={(e) => {
                  // fallback si no existe logo.png
                  e.currentTarget.style.display = "none";
                  const badge = document.getElementById("brand-badge");
                  if (badge) badge.style.display = "flex";
                }}
              />
              <div id="brand-badge" className="brand-badge" style={{ display: "none" }}>
                DMC
              </div>
            </div>

            <div>
              <h1>DMC Dental Solution</h1>
              <p>Accede a tu clínica • Seguro • Multi-clínica</p>
            </div>
          </div>

          <div className="feature">
            <div>🔐 Acceso seguro con Supabase</div>
            <div>🏥 Multi-clínica con permisos</div>
            <div>⚡ Diseño premium + rápido</div>
          </div>
        </div>

        {/* RIGHT (form) */}
        <div className="auth-right">
          <h2 className="auth-title">Iniciar sesión</h2>
          <p className="auth-sub">Bienvenido/a. Ingresa tus credenciales.</p>

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

            <div>
              <label className="label">Contraseña</label>
              <div className="input-wrap">
                <input
                  className="input input-with-btn"
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Tu contraseña"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="icon-btn"
                  onClick={() => setShowPass((s) => !s)}
                  aria-label={showPass ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPass ? "Ocultar" : "Mostrar"}
                </button>
              </div>
            </div>

            <div className="row row-between">
              <label className="check">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                <span>Recordarme</span>
              </label>

              <Link className="link" to="/reset-password">¿Olvidaste tu contraseña?</Link>
            </div>

            <button className="btn btn-primary" disabled={loading}>
              {loading ? "Ingresando..." : "Iniciar sesión"}
            </button>

            <div className="divider" />

            <div className="row">
              <span className="auth-sub" style={{ margin: 0 }}>¿No tienes cuenta?</span>
              <Link className="link" to="/register">Crear cuenta</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
