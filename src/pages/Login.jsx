// src/pages/Login.jsx
import { useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import "../styles/auth.css";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPw, setShowPw] = useState(false);

  const canSubmit = useMemo(() => {
    return email.trim().length > 3 && password.trim().length > 0 && !loading;
  }, [email, password, loading]);

  // ✅ NO TOCAR lógica base: igual a tu login funcional
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      // ✅ Navega a tu dashboard (ajusta si tu ruta principal es otra)
      navigate("/dashboard");
    } catch (err) {
      setError(err?.message || "Ocurrió un error inesperado.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-shell">
        <div className="auth-card">
          {/* LEFT (Premium panel) */}
          <div className="auth-left">
            <div className="brand-row">
              <div className="brand-logo">DMC</div>
              <div>
                <div className="brand-title">DMC Dental Solution</div>
                <div className="brand-sub">
                  Accede a tu clínica • Seguro • Multi-clínica
                </div>
              </div>
            </div>

            <div className="badges">
              <div className="badge">
                <span className="dot" />
                <i>Acceso seguro</i> con Supabase
              </div>
              <div className="badge">
                <span className="dot" />
                <i>Multi-clínica</i> con permisos
              </div>
              <div className="badge">
                <span className="dot" />
                <i>Diseño</i> premium + rápido
              </div>
            </div>

            <div className="auth-left-note">
              Usa tu correo y contraseña para entrar. Si olvidaste la contraseña,
              puedes recuperarla en segundos.
              <br />
              <br />
              <span className="small">
                Tip: si tu cuenta es nueva, crea tu clínica desde “Crear cuenta”.
              </span>
            </div>
          </div>

          {/* RIGHT (Form) */}
          <div className="auth-right">
            <h1 className="auth-h1">Iniciar sesión</h1>
            <div className="auth-h2">Bienvenido/a. Ingresa tus credenciales.</div>

            {error ? <div className="alert error">{error}</div> : null}

            <form className="form" onSubmit={handleLogin}>
              <div className="field">
                <div className="label">Email</div>
                <input
                  className="input"
                  type="email"
                  autoComplete="email"
                  placeholder="correo@clinica.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="field">
                <div className="label">Contraseña</div>
                <div className="pw-wrap">
                  <input
                    className="input"
                    type={showPw ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="pw-btn"
                    onClick={() => setShowPw((v) => !v)}
                  >
                    {showPw ? "Ocultar" : "Mostrar"}
                  </button>
                </div>
              </div>

              <div className="row">
                <label className="small" style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <input type="checkbox" />
                  Recordarme
                </label>

                <Link className="link" to="/forgot-password">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>

              <button className="btn" disabled={!canSubmit}>
                {loading ? "Ingresando..." : "Iniciar sesión"}
              </button>

              <div className="row" style={{ marginTop: 2 }}>
                <div className="small">¿No tienes cuenta?</div>
                <Link className="link" to="/register">
                  Crear cuenta
                </Link>
              </div>

              <div className="footer">© {new Date().getFullYear()} DMC Dental Solution</div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
