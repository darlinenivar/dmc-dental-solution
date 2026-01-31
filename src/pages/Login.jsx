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
        return;
      }

      navigate("/dashboard");
    } catch (err) {
      setError("Error inesperado. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <h1>DMC Dental Solution</h1>
          <p>Accede a tu clínica de forma segura</p>
        </div>

        {error && <div className="login-error">{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="login-field">
            <label>Email</label>
            <input
              type="email"
              placeholder="correo@clinica.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="login-field">
            <label>Contraseña</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button className="login-button" type="submit" disabled={loading}>
            {loading ? "Ingresando..." : "Iniciar sesión"}
          </button>
        </form>

        <div className="login-links">
          <Link to="/forgot-password" className="link-muted">
            ¿Olvidaste tu contraseña?
          </Link>

          <Link to="/register" className="link-primary">
            Crear cuenta / Registrar clínica
          </Link>
        </div>

        <div className="login-footer">
          <span>🔒 Seguridad nivel clínico</span>
        </div>
      </div>
    </div>
  );
}
