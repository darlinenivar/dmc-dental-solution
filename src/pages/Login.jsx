import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import "../styles/login.css";

export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    nav("/dashboard", { replace: true });
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        
        <div className="auth-info">
          <h2>DMC Dental Solution</h2>
          <p>Accede a tu clínica de forma segura</p>
          <ul>
            <li>🔒 Acceso seguro con Supabase</li>
            <li>🏥 Multi-clínica real</li>
            <li>⚡ Diseño premium + rápido</li>
          </ul>
        </div>

        <form className="auth-form" onSubmit={handleLogin}>
          <h3>Iniciar sesión</h3>
          <p>Bienvenido/a, ingresa tus credenciales</p>

          {error && <p style={{ color: "red" }}>{error}</p>}

          <label>Email</label>
          <input value={email} onChange={e => setEmail(e.target.value)} />

          <label>Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />

          <button className="btn-primary" disabled={loading}>
            {loading ? "Ingresando..." : "Iniciar sesión"}
          </button>

          <div className="auth-links">
            <Link to="/forgot-password">¿Olvidaste tu contraseña?</Link>
            <Link to="/register">Crear cuenta</Link>
          </div>

          <div className="auth-footer">
            © 2026 DMC Dental Solution
          </div>
        </form>

      </div>
    </div>
  );
}
