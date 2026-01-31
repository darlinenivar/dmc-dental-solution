import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../supabaseClient";
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
        return;
      }

      navigate("/dashboard", { replace: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-shell">
        <div className="auth-left">
          <div className="brand-row">
            <div className="brand-badge">DMC</div>
            <div>
              <div className="brand-title">DMC Dental Solution</div>
              <div className="brand-sub">Accede a tu clínica • Seguro • Multi-clínica</div>
            </div>
          </div>

          <div className="feature-list">
            <div className="feature-pill">🔒 Acceso seguro con Supabase</div>
            <div className="feature-pill">👥 Multi-clínica real (RLS)</div>
            <div className="feature-pill">⚡ Diseño premium + rápido</div>
          </div>

          <div className="auth-footer">© {new Date().getFullYear()} DMC Dental Solution</div>
        </div>

        <div className="auth-right">
          <div className="auth-title">Iniciar sesión</div>
          <div className="auth-desc">Bienvenido/a. Ingresa tus credenciales.</div>

          <form className="auth-form" onSubmit={handleLogin}>
            <div className="auth-field">
              <label className="auth-label">Email</label>
              <input
                className="auth-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="correo@clinica.com"
                required
              />
            </div>

            <div className="auth-field">
              <label className="auth-label">Contraseña</label>
              <input
                className="auth-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <button className="primary-btn" type="submit" disabled={loading}>
              {loading ? "Ingresando..." : "Iniciar sesión"}
            </button>

            {error && <div className="msg-error">{error}</div>}

            <div className="auth-links">
              <Link className="auth-link" to="/forgot-password">
                ¿Olvidaste tu contraseña?
              </Link>

              <Link className="auth-link" to="/register">
                Crear cuenta
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
