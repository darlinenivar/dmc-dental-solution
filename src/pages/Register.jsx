import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 👇 NUEVO: datos de clínica
  const [clinicName, setClinicName] = useState("");
  const [logoUrl, setLogoUrl] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!clinicName.trim()) {
      setErrorMsg("Por favor escribe el nombre de tu clínica.");
      return;
    }

    setLoading(true);

    // 1) Crear usuario
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
      return;
    }

    // Si Supabase requiere confirmación por email, user puede venir null
    const userId = data?.user?.id;

    // Si no hay userId, lo mandamos a login y listo.
    if (!userId) {
      setLoading(false);
      nav("/login");
      return;
    }

    // 2) Crear clínica (owner = user)
    const { data: clinic, error: clinicErr } = await supabase
      .from("clinics")
      .insert({
        owner_user_id: userId,
        name: clinicName.trim(),
        logo_url: logoUrl.trim() ? logoUrl.trim() : null,
      })
      .select()
      .single();

    if (clinicErr) {
      console.error(clinicErr);
      setErrorMsg("No pude crear la clínica. Revisa RLS/SQL y vuelve a intentar.");
      setLoading(false);
      return;
    }

    // 3) Crear perfil y enlazar clinic_id
    const { error: profileErr } = await supabase
      .from("user_profiles")
      .insert({
        user_id: userId,
        clinic_id: clinic.id,
        role: "owner",
      });

    if (profileErr) {
      console.error(profileErr);
      setErrorMsg("No pude crear el perfil del usuario. Revisa RLS/SQL.");
      setLoading(false);
      return;
    }

    setLoading(false);
    nav("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md border rounded-2xl p-6 bg-white">
        <h1 className="text-xl font-bold mb-1">Crear cuenta</h1>
        <p className="text-sm opacity-70 mb-4">
          DMC Dental Solution
        </p>

        {errorMsg ? (
          <div className="mb-4 text-sm p-3 rounded-xl border border-red-200 bg-red-50">
            {errorMsg}
          </div>
        ) : null}

        <form onSubmit={onSubmit} className="space-y-3">
          <div>
            <label className="text-sm font-medium">Nombre de la clínica</label>
            <input
              className="w-full mt-1 border rounded-xl px-3 py-2"
              value={clinicName}
              onChange={(e) => setClinicName(e.target.value)}
              placeholder="Ej: Clínica Sonrisa"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Logo URL (opcional)</label>
            <input
              className="w-full mt-1 border rounded-xl px-3 py-2"
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="text-sm font-medium">Correo</label>
            <input
              className="w-full mt-1 border rounded-xl px-3 py-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nombre@email.com"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Contraseña</label>
            <input
              className="w-full mt-1 border rounded-xl px-3 py-2"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
            />
          </div>

          <button
            disabled={loading}
            className="w-full rounded-xl px-3 py-2 border bg-black text-white"
          >
            {loading ? "Creando..." : "Crear cuenta"}
          </button>
        </form>
      </div>
    </div>
  );
}
