import { Link } from "react-router-dom";
import "./login.css";

export default function Login() {
  return (
    <div className="login-page">
      <div className="login-card">
        {/* Header */}
        <div className="login-header">
          <h1>DMC Dental Solution</h1>
          <p>Accede a tu clínica de forma segura</p>
        </div>

        {/* FORM – NO TOCAR LÓGICA */}
        <form>
          <div className="field">
            <label>Email</label>
            <input
              type="email"
              placeholder="correo@clinica.com"
              required
            />
          </div>

          <div className="field">
            <label>Contraseña</label>
            <input
              type="password"
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className="btn-primary">
            Iniciar sesión
          </button>
        </form>

        {/* LINKS PREMIUM */}
        <div className="login-links">
          <Link to="/forgot-password" className="link-secondary">
            ¿Olvidaste tu contraseña?
          </Link>

          <div className="divider" />

          <Link to="/register" className="link-primary">
            Crear cuenta / Registrar clínica
          </Link>
        </div>

        {/* Footer */}
        <div className="login-footer">
          Plataforma profesional para clínicas dentales
        </div>
      </div>
    </div>
  );
}
