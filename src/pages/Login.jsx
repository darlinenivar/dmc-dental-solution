import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./styles/login.css";

/**
 * ✍️ AQUÍ CAMBIAS LOS TEXTOS (lo sombreado en tu foto)
 * Solo edita este objeto COPY.
 */
const COPY = {
  brandTitle: "DMC Dental Solution",
  brandSubtitle: "Acceso seguro • Multi-clínicas • Control por roles",

  chips: [
    { icon: "🔒", label: "Seguridad" },
    { icon: "🏥", label: "Multi-clínicas" },
    { icon: "👑", label: "Super Admin" },
  ],

  // ✅ (IZQUIERDA) Este bloque es lo que tú sombreaste
  bullets: [
    "Hecho para consultorios reales: inicio de sesión rápido, seguro y sin complicaciones.",
    "Diseño premium y legible: funciona perfecto en laptop, tablet y móvil (sin tener que sombrear).",
  ],

  // ✅ (IZQUIERDA) Si no quieres “tip”, déjalo vacío: tip: ""
  tip: "Si no te llega el correo de recuperación, revisa Spam o solicita reenvío.",

  // ✅ (ABAJO) Texto pequeño bajo “Crear usuario” (lo sombreado abajo)
  createUserHint:
    "Crea tu clínica y tu cuenta en 1 paso. Luego podrás invitar a tu equipo y asignar roles.",

  formTitle: "Iniciar sesión",
  formSubtitle: "Accede a tu consultorio con seguridad.",

  labels: {
    email: "Email",
    password: "Contraseña",
    login: "Iniciar sesión",
    forgot: "¿Olvidaste tu contraseña?",
    createUser: "Crear usuario",
  },
};

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const superAdminEmails = useMemo(() => {
    // Si tienes VITE_SUPER_ADMIN_EMAILS (separado por comas)
    const raw = import.meta.env.VITE_SUPER_ADMIN_EMAILS || "";
    return raw
      .split(",")
      .map((x) => x.trim().toLowerCase())
      .filter(Boolean);
  }, []);

  const isSuperAdmin = useMemo(() => {
    return superAdminEmails.includes((email || "").trim().toLowerCase());
  }, [email, superAdminEmails]);

  async function handleLogin(e) {
    e.preventDefault();
    setMsg("");
    setLoading(true);

    try {
      // ✅ Aquí NO estoy forzando supabase para no romperte si estás cambiando auth.
      // Si ya tienes tu login con supabase, reemplaza este bloque por tu signIn real.
      // Por ahora simulo validación básica:
      if (!email.includes("@")) throw new Error("Escribe un email válido.");
      if (password.length < 6) throw new Error("Contraseña inválida.");

      // Simulación: redirige al dashboard
      navigate("/dashboard");
    } catch (err) {
      setMsg(err?.message || "No se pudo iniciar sesión.");
    } finally {
      setLoading(false);
    }
  }

  function handleForgot() {
    // ✅ si ya tienes /reset-password o /update-password, ponlo aquí.
    // Ejemplo:
    // navigate("/reset-password");
    setMsg(
      "Función de recuperación: conecta tu pantalla /reset-password o /update-password y el envío por Supabase."
    );
  }

  function handleCreateUser() {
    // ✅ si ya tienes /register, ponlo aquí:
    // navigate("/register");
    setMsg(
      "Abrir registro: conecta tu ruta /register (cuenta + clínica en 1 paso)."
    );
  }

  return (
    <div className="loginShell">
      <div className="loginBg" />

      <div className="loginCard">
        {/* LEFT */}
        <div className="loginLeft">
          <div className="brandRow">
            <div className="brandLogo">DMC</div>
            <div className="brandText">
              <div className="brandTitle">{COPY.brandTitle}</div>
              <div className="brandSubtitle">{COPY.brandSubtitle}</div>
            </div>
          </div>

          <div className="chipRow">
            {COPY.chips.map((c) => (
              <div key={c.label} className="chip">
                <span className="chipIcon">{c.icon}</span>
                <span>{c.label}</span>
              </div>
            ))}
          </div>

          <div className="bulletList">
            {COPY.bullets.map((b) => (
              <div key={b} className="bullet">
                <span className="bulletCheck">✅</span>
                <span className="bulletText">{b}</span>
              </div>
            ))}
          </div>

          {COPY.tip ? <div className="tip">{COPY.tip}</div> : null}

          <div className="leftMiniNote">
            <span className="dot" />
            <span>
              {isSuperAdmin
                ? "Modo Super Admin detectado: podrás administrar clínicas y usuarios."
                : "Acceso por clínica: cada usuario verá solo su información."}
            </span>
          </div>
        </div>

        {/* RIGHT */}
        <div className="loginRight">
          <h2 className="formTitle">{COPY.formTitle}</h2>
          <p className="formSubtitle">{COPY.formSubtitle}</p>

          <form className="form" onSubmit={handleLogin}>
            <label className="label">{COPY.labels.email}</label>
            <input
              className="input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tuemail@clinica.com"
              autoComplete="email"
            />

            <label className="label">{COPY.labels.password}</label>
            <div className="passRow">
              <input
                className="input"
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
              />
              <button
                type="button"
                className="ghostBtn"
                onClick={() => setShowPass((s) => !s)}
              >
                {showPass ? "Ocultar" : "Ver"}
              </button>
            </div>

            <button className="primaryBtn" disabled={loading}>
              {loading ? "Entrando..." : COPY.labels.login}
            </button>

            <div className="rowBetween">
              <button
                type="button"
                className="linkBtn"
                onClick={handleForgot}
              >
                {COPY.labels.forgot}
              </button>
            </div>

            <div className="divider" />

            <button
              type="button"
              className="secondaryBtn"
              onClick={handleCreateUser}
            >
              {COPY.labels.createUser}
            </button>

            <div className="smallHint">{COPY.createUserHint}</div>

            {msg ? <div className="msg">{msg}</div> : null}

            {/* Si ya tienes rutas reales, puedes usar Link:
                <Link to="/register">Crear usuario</Link>
                <Link to="/reset-password">¿Olvidaste tu contraseña?</Link>
            */}
            <div className="tinyLinks">
              <span className="muted">
                ¿Ya tienes cuenta?{" "}
                <Link className="tinyLink" to="/login">
                  Login
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>

      <div className="footerLine">
        © {new Date().getFullYear()} DMC Dental Solution
      </div>
    </div>
  );
}
