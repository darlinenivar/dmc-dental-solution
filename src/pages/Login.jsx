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
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        return;
      }

      // ✅ Si logea bien, redirige
      // Ajusta esta ruta si tu app usa otra (ej: "/dashboard" o "/")
      if (data?.session) {
        navigate("/dashboard");
      } else {
        // fallback por si Supabase tarda en devolver session
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err?.message || "Error inesperado iniciando sesión.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="login-brand">
          <div className="login-badge">DMC</div>
          <div>
            <h1 className="login-title">DMC Dental Solution</h1>
            <p className="login-subtitle">Accede a tu clínica de forma segura</p>
          </div>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="correo@clinica.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div className="input-group">
            <label>Contraseña</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          {error ? <div className="login-error">{error}</div> : null}

          {/* ✅ NO tocar lógica del submit */}
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? (
              <span className="btn-loading">
                <span className="spinner" /> Ingresando...
              </span>
            ) : (
              "Iniciar sesión"
            )}
          </button>
        </form>

        <div className="login-divider">
          <span>Opciones</span>
        </div>

        <div className="login-links">
          <Link to="/forgot-password" className="link-premium">
            ¿Olvidaste tu contraseña?
          </Link>

          <Link to="/register" className="link-premium secondary">
            Crear cuenta / Registrar clínica
          </Link>
        </div>

        <p className="login-footnote">
          © {new Date().getFullYear()} DMC Dental Solution · Seguridad y confianza
        </p>
      </div>
    </div>
  );
}
