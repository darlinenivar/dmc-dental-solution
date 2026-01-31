// src/pages/Register.jsx
import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import "../styles/auth.css";

export default function Register() {
  const navigate = useNavigate();

  // Login details
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState(""); // opcional
  const [email, setEmail] = useState("");

  // Password
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [showPw, setShowPw] = useState(false);

  // Clinic
  const [clinicName, setClinicName] = useState("");
  const [country, setCountry] = useState("United States");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");

  const canSubmit = useMemo(() => {
    if (loading) return false;
    if (!firstName.trim() || !lastName.trim()) return false;
    if (!email.trim() || email.trim().length < 4) return false;
    if (!password || password.length < 6) return false;
    if (password !== password2) return false;
    if (!clinicName.trim()) return false;
    return true;
  }, [loading, firstName, lastName, email, password, password2, clinicName]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setOk("");
    setLoading(true);

    try {
      if (password !== password2) {
        setError("Las contraseñas no coinciden.");
        setLoading(false);
        return;
      }
      if (password.length < 6) {
        setError("La contraseña debe tener mínimo 6 caracteres.");
        setLoading(false);
        return;
      }

      // ✅ Crea usuario en Supabase Auth
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            first_name: firstName.trim(),
            last_name: lastName.trim(),
            phone: phone.trim() || null,
            clinic_name: clinicName.trim(),
            country,
          },
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        setLoading(false);
        return;
      }

      // A veces el user viene en data.user, a veces hay que esperar sesión
      const userId = data?.user?.id;

      // ✅ Si ya tienes trigger en BD, esto es opcional.
      // Si NO tienes trigger, intenta crear la clínica aquí.
      if (userId) {
        const { error: clinicError } = await supabase
          .from("clinics")
          .insert([
            {
              name: clinicName.trim(),
              country,
              owner_user_id: userId,
            },
          ]);

        // Si falla por RLS o porque ya existe por trigger, no rompas el flujo.
        if (clinicError) {
          // Solo avisamos suave, no bloqueamos
          console.warn("Clinic insert warning:", clinicError.message);
        }
      }

      setOk(
        "Cuenta creada. Revisa tu correo para verificar (si tu proyecto tiene verificación activada). Luego inicia sesión."
      );

      // opcional: mandar al login luego de 1s
      setTimeout(() => navigate("/login"), 900);
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
          <div className="auth-left">
            <div className="brand-row">
              <div className="brand-logo">DMC</div>
              <div>
                <div className="brand-title">DMC Dental Solution</div>
                <div className="brand-sub">Registro premium • Se crea tu clínica automáticamente</div>
              </div>
            </div>

            <div className="badges">
              <div className="badge">
                <span className="dot" />
                <i>1 sola página</i> para registrarse
              </div>
              <div className="badge">
                <span className="dot" />
                <i>Multi-clínica</i> real (RLS + Supabase)
              </div>
              <div className="badge">
                <span className="dot" />
                <i>Clínica automática</i> al crear cuenta
              </div>
            </div>

            <div className="auth-left-note">
              Completa tus datos y la información de tu clínica. Luego podrás gestionar doctores, pacientes
              y citas desde el dashboard.
            </div>
          </div>

          <div className="auth-right">
            <h1 className="auth-h1">Crear cuenta</h1>
            <div className="auth-h2">Completa tus datos y la información de tu clínica.</div>

            {error ? <div className="alert error">{error}</div> : null}
            {ok ? <div className="alert ok">{ok}</div> : null}

            <form className="form" onSubmit={handleRegister}>
              <div className="two">
                <div className="field">
                  <div className="label">Nombre</div>
                  <input
                    className="input"
                    placeholder="Ej: Darline"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>

                <div className="field">
                  <div className="label">Apellido</div>
                  <input
                    className="input"
                    placeholder="Ej: Nivar"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>

              <div className="two">
                <div className="field">
                  <div className="label">Email</div>
                  <input
                    className="input"
                    type="email"
                    autoComplete="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="field">
                  <div className="label">Teléfono (opcional)</div>
                  <input
                    className="input"
                    placeholder="+1 809..."
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>

              <div className="two">
                <div className="field">
                  <div className="label">Contraseña</div>
                  <div className="pw-wrap">
                    <input
                      className="input"
                      type={showPw ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="Mínimo 6 caracteres"
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

                <div className="field">
                  <div className="label">Repetir contraseña</div>
                  <input
                    className="input"
                    type={showPw ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Repite la contraseña"
                    value={password2}
                    onChange={(e) => setPassword2(e.target.value)}
                  />
                </div>
              </div>

              <div className="two">
                <div className="field">
                  <div className="label">Nombre de la clínica</div>
                  <input
                    className="input"
                    placeholder="Ej: DMC Dental - Manhattan"
                    value={clinicName}
                    onChange={(e) => setClinicName(e.target.value)}
                  />
                </div>

                <div className="field">
                  <div className="label">País</div>
                  <select
                    className="input"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                  >
                    <option>United States</option>
                    <option>Dominican Republic</option>
                    <option>Puerto Rico</option>
                    <option>Mexico</option>
                    <option>Colombia</option>
                    <option>Spain</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>

              <button className="btn" disabled={!canSubmit}>
                {loading ? "Creando..." : "Crear mi cuenta"}
              </button>

              <div className="row" style={{ marginTop: 8 }}>
                <div className="small">¿Ya tienes cuenta?</div>
                <Link className="link" to="/login">Login ahora</Link>
              </div>

              <div className="footer">© {new Date().getFullYear()} DMC Dental Solution</div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
