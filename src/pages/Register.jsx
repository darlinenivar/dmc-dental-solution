import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/auth.css";
import { supabase } from "../supabaseClient";

export default function Register() {
  const navigate = useNavigate();

  const [clinicName, setClinicName] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!clinicName.trim()) return setError("Escribe el nombre de la clínica.");
    if (!fullName.trim()) return setError("Escribe tu nombre completo.");
    if (!email.trim()) return setError("Escribe tu email.");
    if (password.length < 6) return setError("La contraseña debe tener mínimo 6 caracteres.");

    try {
      setLoading(true);

      // 1) Crear usuario en Supabase Auth
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            clinic_name: clinicName,
          },
        },
      });

      if (signUpError) throw signUpError;

      // 2) Si tu DB tiene trigger para crear clinic/profile, ya se crea solo.
      // Si no, lo hacemos aquí (opcional). Lo dejo comentado para no romper si aún no existe la tabla.
      // const userId = data?.user?.id;
      // if (userId) {
      //   await supabase.from("clinics").insert([{ name: clinicName, owner_user_id: userId }]);
      // }

      // 3) Redirigir (si confirmación por email está ON, mandamos al login)
      navigate("/login", { replace: true });
    } catch (err) {
      setError(err?.message || "No se pudo crear la cuenta.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Crear cuenta</h2>
        <p className="auth-subtitle">Registra tu clínica y tu usuario administrador</p>

        <form onSubmit={onSubmit}>
          <label>Nombre de la clínica</label>
          <input
            type="text"
            placeholder="Ej: DMC Dental Solution"
            value={clinicName}
            onChange={(e) => setClinicName(e.target.value)}
            required
          />

          <label>Nombre completo</label>
          <input
            type="text"
            placeholder="Ej: Darline Nivar"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />

          <label>Email</label>
          <input
            type="email"
            placeholder="tuemail@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Contraseña</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <div className="error">{error}</div>}

          <button type="submit" disabled={loading}>
            {loading ? "Creando..." : "Crear cuenta"}
          </button>
        </form>

        {/* ✅ QUITADO: el botón/Link de "volver al inicio" */}
        <div className="auth-links">
          <Link to="/login">Ya tengo cuenta / Iniciar sesión</Link>
        </div>
      </div>
    </div>
  );
}
