import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "../styles/login.css";

export default function Register() {
  const nav = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [clinicName, setClinicName] = useState("");
  const [country, setCountry] = useState("United States");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (password !== password2) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);
    try {
      const full_name = `${firstName} ${lastName}`.trim();

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name,
            phone: phone || null,
            clinic_name: clinicName || "Mi Clínica",
            country: country || "United States",
          },
        },
      });

      if (error) {
        setError(error.message);
        return;
      }

      // Si tienes confirmación por email activada, aquí no habrá sesión aún.
      setMessage(
        "Cuenta creada ✅ Revisa tu email para confirmar. Al confirmar, se crea tu clínica automáticamente."
      );

      // Si NO usas confirmación por email y hay sesión, redirige:
      if (data?.session) {
        nav("/dashboard", { replace: true });
      }
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
              <div className="brand-sub">Registro premium • Se crea tu clínica automáticamente</div>
            </div>
          </div>

          <div className="feature-list">
            <div className="feature-pill">✅ 1 sola página para registrarse</div>
            <div className="feature-pill">✅ Multi-clínica real (RLS + Supabase)</div>
            <div className="feature-pill">✅ Clínica automática al crear cuenta</div>
          </div>

          <div className="auth-desc" style={{ marginTop: 14 }}>
            Completa tus datos y la información de tu clínica. Luego podrás gestionar doctores,
            pacientes y citas desde el dashboard.
          </div>

          <div className="auth-footer">© {new Date().getFullYear()} DMC Dental Solution</div>
        </div>

        <div className="auth-right">
          <div className="auth-title">Crear cuenta</div>
          <div className="auth-desc">Completa tus datos y la información de tu clínica.</div>

          <form className="auth-form" onSubmit={onSubmit}>
            <div className="auth-field" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div>
                <label className="auth-label">Nombre</label>
                <input className="auth-input" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Ej: Darline" required />
              </div>
              <div>
                <label className="auth-label">Apellido</label>
                <input className="auth-input" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Ej: Nivar" required />
              </div>
            </div>

            <div className="auth-field" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div>
                <label className="auth-label">Email</label>
                <input className="auth-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@email.com" required />
              </div>
              <div>
                <label className="auth-label">Teléfono (opcional)</label>
                <input className="auth-input" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 809..." />
              </div>
            </div>

            <div className="auth-field" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div>
                <label className="auth-label">Contraseña</label>
                <input className="auth-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mínimo 6 caracteres" required />
              </div>
              <div>
                <label className="auth-label">Repetir contraseña</label>
                <input className="auth-input" type="password" value={password2} onChange={(e) => setPassword2(e.target.value)} placeholder="Repite la contraseña" required />
              </div>
            </div>

            <div className="auth-field" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div>
                <label className="auth-label">Nombre de la clínica</label>
                <input className="auth-input" value={clinicName} onChange={(e) => setClinicName(e.target.value)} placeholder="Ej: DMC Dental - Manhattan" required />
              </div>
              <div>
                <label className="auth-label">País</label>
                <select className="auth-input" value={country} onChange={(e) => setCountry(e.target.value)}>
                  <option>United States</option>
                  <option>Dominican Republic</option>
                  <option>Puerto Rico</option>
                  <option>Mexico</option>
                  <option>Colombia</option>
                </select>
              </div>
            </div>

            <button className="primary-btn" type="submit" disabled={loading}>
              {loading ? "Creando..." : "Crear mi cuenta"}
            </button>

            {error && <div className="msg-error">{error}</div>}
            {message && <div className="msg-success">{message}</div>}

            <div className="auth-links">
              <Link className="auth-link" to="/login">Login ahora</Link>
              <Link className="auth-link" to="/login">Volver al inicio</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
