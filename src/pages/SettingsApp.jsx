import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useClinic } from "../context/ClinicContext";

export default function SettingsApp() {
  const { clinic, loading, refreshClinic } = useClinic();

  const [name, setName] = useState("");
  const [logoPreview, setLogoPreview] = useState(null);
  const [logoFile, setLogoFile] = useState(null);

  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    if (clinic?.name) setName(clinic.name);
    setLogoPreview(clinic?.logo_url || null);
  }, [clinic]);

  const uploadLogo = async (clinicId) => {
    if (!logoFile) return null;

    const { data: authData } = await supabase.auth.getUser();
    const user = authData?.user;
    if (!user) throw new Error("No hay sesión activa.");

    const ext = (logoFile.name.split(".").pop() || "png").toLowerCase();
    const path = `${user.id}/${clinicId}/${Date.now()}.${ext}`;

    const { error } = await supabase.storage.from("clinic-logos").upload(path, logoFile, {
      upsert: true,
    });
    if (error) throw error;

    const { data } = supabase.storage.from("clinic-logos").getPublicUrl(path);
    return data.publicUrl;
  };

  const onPickLogo = (file) => {
    setLogoFile(file || null);
    if (!file) return;
    setLogoPreview(URL.createObjectURL(file));
  };

  const onSave = async () => {
    setMsg(null);

    if (!clinic?.id) {
      setMsg("No se encontró la clínica. Inicia sesión de nuevo.");
      return;
    }
    if (!name.trim()) {
      setMsg("El nombre de la clínica no puede estar vacío.");
      return;
    }

    setSaving(true);
    try {
      const newLogoUrl = await uploadLogo(clinic.id);

      const payload = { name: name.trim() };
      if (newLogoUrl) payload.logo_url = newLogoUrl;

      const { error } = await supabase.from("clinics").update(payload).eq("id", clinic.id);
      if (error) throw error;

      await refreshClinic();

      setLogoFile(null);
      setMsg("✅ Cambios guardados.");
    } catch (e) {
      setMsg(e?.message || "Error guardando cambios.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6">Cargando...</div>;

  return (
    <div className="p-6 max-w-3xl">
      <div className="text-2xl font-bold">App configuration</div>
      <div className="opacity-70 mt-1">Cambia nombre y logo de tu clínica.</div>

      <div className="mt-6 rounded-2xl border bg-white p-5">
        <div className="text-lg font-semibold">Marca de la clínica</div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-[120px_1fr] gap-4 items-center">
          <div>
            {logoPreview ? (
              <img
                src={logoPreview}
                alt="Logo preview"
                className="h-20 w-20 rounded-2xl object-cover border"
              />
            ) : (
              <div className="h-20 w-20 rounded-2xl border flex items-center justify-center font-bold">
                LOGO
              </div>
            )}
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-sm opacity-70">Nombre de la clínica</label>
              <input
                className="w-full border rounded-xl px-3 py-2 mt-1"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: Clínica Dental Sonrisa Perfecta"
              />
            </div>

            <div>
              <label className="text-sm opacity-70">Cambiar logo</label>
              <input
                className="w-full mt-1"
                type="file"
                accept="image/*"
                onChange={(e) => onPickLogo(e.target.files?.[0] || null)}
              />
              <div className="text-xs opacity-60 mt-1">Recomendado 256x256 o más.</div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={onSave}
                disabled={saving}
                className="rounded-xl px-4 py-2 bg-indigo-600 text-white font-semibold disabled:opacity-50"
              >
                {saving ? "Guardando..." : "Guardar"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setName(clinic?.name || "");
                  setLogoPreview(clinic?.logo_url || null);
                  setLogoFile(null);
                  setMsg(null);
                }}
                className="rounded-xl px-4 py-2 border font-semibold"
              >
                Descartar
              </button>
            </div>

            {msg && <div className="text-sm mt-2">{msg}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
