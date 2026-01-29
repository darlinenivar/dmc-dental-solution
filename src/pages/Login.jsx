import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import "../styles/auth.css";

function parseSuperAdmins() {
  const raw = import.meta.env.VITE_SUPER_ADMIN_EMAILS || "";
  return raw
    .split(",")
    .map((x) => x.trim().toLowerCase())
    .filter(Boolean);
}

export default function Login() {
  const nav = useNavigate();
  const superAdmins = useMemo(() => parseSuperAdmins(), []);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });

  const isSuperAdmin = (e) => superAdmins.includes((e || "").toLowerCase());

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg({ type: "", text: "" });

    if (!email || !password) {
      setMsg({ type: "error", text: "Completa email y contraseña." });
      return;
    }

    try {
      setLoading(true);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Guardamos rol básico local (para UI). Lo “real” lo controlas con DB/RLS.
      const role = isSuperAdmin(data?.user?.email) ? "super_admin" : "user";
      localStorage.setItem("dmc_role", role);

      nav("/dashboard");
    } catch (err) {
      setMsg({
        type: "error",
        text:
          err?.message ||
          "No se pudo iniciar sesión. Verifica tus datos e intenta de nuevo.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-shell">
        <div className="auth-hero">
          <div className="auth-hero-inner">
            <div className="brand-row">
              <div className="brand-badge">DMC</div>
              <div>
                <h1 className="brand-title">DMC Dental Solution</h1>
                <p className="brand-sub">Multiclínicas • Roles • Control total</p>
              </div>
            </div>

            <div className="hero-copy">
              <h2>Accede a tu consultorio</h2>
              <p>
                Panel profesional con seguridad, usuarios por clínica y acceso de
                <b> Super Admin</b> para administrar todo.
              </p>
            </div>

            <div className="hero-pill-row">
              <span className="pill"><span className="pill-dot" /> Citas</span>
              <span className="pill"><span className="pill-dot" /> Pacientes</span>
              <span className="pill"><span className="pill-dot" /> Facturación</span>
              <span className="pill"><span className="pill-dot" /> Multiclínicas</span>
            </div>

            <p className="small-note">
              Tip: si eres Super Admin, agrega tu email en Netlify/ENV como
              <b> VITE_SUPER_ADMIN_EMAILS</b> (separado por comas).
            </p>
          </div>
        </div>

        <div className="auth-card">
          <h3>Iniciar sesión</h3>
          <p>Acceso seguro para tu cuenta</p>

          {msg.text ? (
            <div className={`alert ${msg.type}`}>{msg.text}</div>
          ) : null}

          <form className="form-grid" onSubmit={onSubmit}>
            <div className="field">
              <label>Email</label>
              <input
                className="input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tucorreo@clinica.com"
                autoComplete="email"
              />
            </div>

            <div className="field">
              <label>Contraseña</label>
              <input
                className="input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
              />

              <div className="helper-row">
                <button
                  type="button"
                  className="link"
                  onClick={() => nav("/forgot-password")}
                >
                  ¿Olvidaste tu contraseña?
                </button>

                <button
                  type="button"
                  className="link"
                  onClick={() => nav("/register")}
                >
                  Crear usuario
                </button>
              </div>
            </div>

            <button className="btn btn-primary" disabled={loading}>
              {loading ? "Entrando..." : "Iniciar sesión"}
            </button>

            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => {
                setEmail("");
                setPassword("");
                setMsg({ type: "", text: "" });
              }}
            >
              Limpiar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
