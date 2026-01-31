import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import "../styles/login.css";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

      // NO tocar tu flujo si ya funciona, solo navegar:
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err?.message || "Error iniciando sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-bg">
      <div className="auth-shell">
        <div className="auth-card">
          {/* Left */}
          <div className="auth-left">
            <div className="brand-row">
              <div className="brand-logo">DMC</div>
              <div>
                <div className="brand-title">DMC Dental Solution</div>
                <div className="brand-subtitle">
                  Accede a tu clínica • Seguro • Multi-clínica
                </div>
              </div>
            </div>

            <div className="badge-row">
              <span className="badge">🔒 Acceso seguro con Supabase</span>
              <span className="badge">🧩 Multi-clínica con permisos</span>
              <span className="badge">⚡ Diseño premium + rápido</span>
            </div>

            <div className="hint">
              Si olvidaste tu contraseña, usa la opción “Recuperar contraseña”.
            </div>
          </div>

          {/* Right */}
          <div className="auth-right">
            <h2 className="auth-h">Iniciar sesión</h2>
            <p className="auth-p">Bienvenido/a. Ingresa tus credenciales.</p>

            {error ? <div className="auth-error">{error}</div> : null}

            <form onSubmit={handleLogin} className="auth-form">
              <label className="auth-label">Email</label>
              <input
                className="auth-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="correo@clinica.com"
                autoComplete="email"
              />

              <label className="auth-label">Contraseña</label>
              <div className="auth-passrow">
                <input
                  className="auth-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  type="password"
                  autoComplete="current-password"
                />
              </div>

              <div className="auth-row">
                <label className="auth-check">
                  <input type="checkbox" />
                  <span>Recordarme</span>
                </label>

                {/* ✅ Link FUERA de botones submit */}
                <Link className="auth-link" to="/forgot-password">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>

              <button className="auth-btn" type="submit" disabled={loading}>
                {loading ? "Ingresando..." : "Iniciar sesión"}
              </button>
            </form>

            <div className="auth-footer">
              <span>¿No tienes cuenta?</span>
              <Link className="auth-link strong" to="/register">
                Crear cuenta
              </Link>
            </div>

            <div className="auth-copy">© {new Date().getFullYear()} DMC Dental Solution</div>
          </div>
        </div>
      </div>
    </div>
  );
}
