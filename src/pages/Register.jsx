import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function Register() {
  const navigate = useNavigate();

  const [clinicName, setClinicName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      /* =========================
         1️⃣ Crear usuario (Auth)
      ========================= */
      const { data: signUpData, error: signUpError } =
        await supabase.auth.signUp({
          email,
          password,
        });

      if (signUpError) throw signUpError;

      const user = signUpData.user;
      if (!user) throw new Error("Usuario no creado");

      /* =========================
         2️⃣ Crear clínica
         (USA owner_user_id)
      ========================= */
      const { data: clinic, error: clinicError } = await supabase
        .from("clinics")
        .insert({
          name: clinicName,
          owner_user_id: user.id, // 👈 CLAVE
        })
        .select()
        .single();

      if (clinicError) throw clinicError;

      /* =========================
         3️⃣ Relación usuario ↔ clínica
      ========================= */
      const { error: clinicUserError } = await supabase
        .from("clinic_users")
        .insert({
          clinic_id: clinic.id,
          user_id: user.id,
          role: "admin",
        });

      if (clinicUserError) throw clinicUserError;

      /* =========================
         4️⃣ Actualizar profile
      ========================= */
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ clinic_id: clinic.id })
        .eq("id", user.id);

      if (profileError) throw profileError;

      /* =========================
         5️⃣ Guardar contexto local
      ========================= */
      localStorage.setItem("clinicId", clinic.id);
      localStorage.setItem("clinic", JSON.stringify(clinic));

      /* =========================
         6️⃣ Ir al dashboard
      ========================= */
      navigate("/dashboard");
    } catch (err) {
      console.error("Register error:", err);
      setError(err.message || "Error creando la cuenta");
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleRegister}>
        <h2>Crear cuenta</h2>

        {error && <p className="error">{error}</p>}

        <label>Nombre de la clínica</label>
        <input
          type="text"
          value={clinicName}
          onChange={(e) => setClinicName(e.target.value)}
          placeholder="Ej. DMC Dental Solution"
          required
        />

        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Contraseña</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Creando cuenta..." : "Crear cuenta"}
        </button>
      </form>
    </div>
  );
}
