import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "./login.css";

export default function Login() {
  const navigate = useNavigate();

  const [mode, setMode] = useState("password"); // "password" | "magic"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPass, setShowPass] = useState(false);
  const [rememberEmail, setRememberEmail] = useState(true);

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  const [error, setError] = useState(null);

  const emailOk = useMemo(() => {
    const v = email.trim();
    return v.includes("@") && v.includes(".");
  }, [email]);

  useEffect(() => {
    // Cargar email recordado
    try {
      const saved = localStorage.getItem("dmc_remember_email");
      const savedEmail = localStorage.getItem("dmc_email");
      if (saved === "1" && savedEmail) setEmail(savedEmail);
    } catch (_) {}
  }, []);

  const remember = () => {
    try {
      localStorage.setItem("dmc_remember_email", rememberEmail ? "1" : "0");
      if (rememberEmail) localStorage.setItem("dmc_email", email.trim());
      else localStorage.removeItem("dmc_email");
    } catch (_) {}
  };

  const goDashboard = () => navigate("/dashboard", { replace: true });

  const handlePasswordLogin = async () => {
    setLoading(true);
    setError(null);
    setMsg(null);

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    remember();
    goDashboard();
  };

  const handleMagicLink = async () => {
    setLoading(true);
    setError(null);
    setMsg(null);

    const redirectTo = `${window.location.origin}/auth/callback`;

    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: redirectTo,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    remember();
    setMsg("Te enviamos un link a tu email. Abre el correo y vuelve a la app.");
    setLoading(false);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!emailOk) {
      setError("Escribe un email válido.");
      return;
    }
    if (mode === "password") {
      if (!password) {
        setError("Escribe tu contraseña.");
        return;
      }
      await handlePasswordLogin();
    } else {
      await handleMagicLink();
    }
  };

  return (
    <div className="dmc-auth">
      <div className="dmc-auth__bg" aria-hidden="true" />

      <div className="dmc-auth__shell">
        <div className="dmc-auth__brand">
          {/* Si tienes logo en /public/dmc-logo-white.png se verá aquí */}
          <img
            className="dmc-auth__logo"
            src="/dmc-logo-white.png"
            alt="DMC Dental Solution"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
          <div className="dmc-auth__brandText">
            <div className="dmc-auth__title">DMC Dental Solution</div>
            <div className="dmc-auth__subtitle">
              Gestión clínica • Citas • Pacientes • Facturación
            </div>
          </div>
        </div>

        <div className="dmc-card">
          <div className="dmc-card__header">
            <h1 className="dmc-card__h1">Iniciar sesión</h1>
            <p className="dmc-card__p">
              Accede a tu clínica de forma segura.
            </p>

            <div className="dmc-tabs" role="tablist" aria-label="Modo de inicio">
              <button
                type="button"
                className={`dmc-tab ${mode === "password" ? "is-active" : ""}`}
                onClick={() => {
                  setMode("password");
                  setError(null);
                  setMsg(null);
                }}
                role="tab"
                aria-selected={mode === "password"}
              >
                Contraseña
              </button>

              <button
                type="button"
                className={`dmc-tab ${mode === "magic" ? "is-active" : ""}`}
                onClick={() => {
                  setMode("magic");
                  setError(null);
                  setMsg(null);
                }}
                role="tab"
                aria-selected={mode === "magic"}
              >
                Link mágico
              </button>
            </div>
          </div>

          <form className="dmc-form" onSubmit={onSubmit}>
            {error && <div className="dmc-alert dmc-alert--error">{error}</div>}
            {msg && <div className="dmc-alert dmc-alert--ok">{msg}</div>}

            <div className="dmc-field">
              <label className="dmc-label">Email</label>
              <div className="dmc-inputWrap">
                <input
                  className="dmc-input"
                  type="email"
                  placeholder="tuemail@clinica.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            {mode === "password" && (
              <div className="dmc-field">
                <label className="dmc-label">Contraseña</label>
                <div className="dmc-inputWrap">
                  <input
                    className="dmc-input"
                    type={showPass ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    className="dmc-iconBtn"
                    onClick={() => setShowPass((v) => !v)}
                    aria-label={showPass ? "Ocultar contraseña" : "Mostrar contraseña"}
                    title={showPass ? "Ocultar" : "Mostrar"}
                  >
                    {showPass ? "🙈" : "👁️"}
                  </button>
                </div>

                <div className="dmc-row dmc-row--space">
                  <label className="dmc-check">
                    <input
                      type="checkbox"
                      checked={rememberEmail}
                      onChange={(e) => setRememberEmail(e.target.checked)}
                    />
                    <span>Recordar mi email</span>
                  </label>

                  <Link className="dmc-link" to="/forgot-password">
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
              </div>
            )}

            {mode === "magic" && (
              <div className="dmc-help">
                <div className="dmc-help__title">Entrar sin contraseña</div>
                <div className="dmc-help__text">
                  Te enviamos un link al email. Ábrelo y entrarás automáticamente.
                </div>

                <label className="dmc-check dmc-check--magic">
                  <input
                    type="checkbox"
                    checked={rememberEmail}
                    onChange={(e) => setRememberEmail(e.target.checked)}
                  />
                  <span>Recordar mi email</span>
                </label>
              </div>
            )}

            <button
              className="dmc-btn dmc-btn--primary"
              type="submit"
              disabled={loading || !emailOk || (mode === "password" && !password)}
            >
              {loading
                ? "Procesando..."
                : mode === "password"
                ? "Iniciar sesión"
                : "Enviar link mágico"}
            </button>

            <div className="dmc-divider">
              <span>o</span>
            </div>

            <Link className="dmc-btn dmc-btn--ghost" to="/register">
              Crear cuenta / Registrar clínica
            </Link>

            <div className="dmc-footer">
              <span className="dmc-footer__muted">
                Al continuar, aceptas las políticas de la clínica.
              </span>
            </div>
          </form>
        </div>

        <div className="dmc-mini">
          <span className="dmc-mini__dot" />
          <span>Conexión segura • Acceso por roles • Multi-clínica</span>
        </div>
      </div>
    </div>
  );
}
