import React, { useEffect, useState, useMemo } from "react";
import "../styles/settingsApp.css";
import { supabase } from "../lib/supabaseClient";
import { useClinic } from "../context/ClinicContext";

export default function SettingsApp() {
  const { clinic, loading, refreshClinic } = useClinic();

  const [name, setName] = useState("");
  const [logoPreview, setLogoPreview] = useState(null);
  const [logoFile, setLogoFile] = useState(null);

  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  /* =========================
     ENV CHECK (PRO)
  ========================= */
  const envStatus = useMemo(() => {
    const missing = [];
    if (!import.meta.env.VITE_SITE_URL) missing.push("VITE_SITE_URL");
    if (!import.meta.env.VITE_SUPABASE_URL) missing.push("VITE_SUPABASE_URL");
    if (!import.meta.env.VITE_SUPABASE_ANON_KEY)
      missing.push("VITE_SUPABASE_ANON_KEY");

    return {
      ok: missing.length === 0,
      missing,
    };
  }, []);

  /* =========================
     INIT
  ========================= */
  useEffect(() => {
    if (clinic?.name) setName(clinic.name);
    if (clinic?.logo_url) setLogoPreview(clinic.logo_url);
  }, [clinic]);

  /* =========================
     HELPERS
  ========================= */
  async function uploadLogo(clinicId) {
    if (!logoFile) return null;

    const ext = logoFile.name.split(".").pop();
    const path = `${clinicId}/${Date.now()}.${ext}`;

    const { error } = await supabase.storage
      .from("clinic-logos")
      .upload(path, logoFile, { upsert: true });

    if (error) throw error;

    const { data } = supabase.storage
      .from("clinic-logos")
      .getPublicUrl(path);

    return data.publicUrl;
  }

  /* =========================
     SAVE
  ========================= */
  async function onSave() {
    if (!clinic?.id) {
      setMsg("No se encontró la clínica.");
      return;
    }

    if (!name.trim()) {
      setMsg("El nombre no puede estar vacío.");
      return;
    }

    try {
      setSaving(true);
      setMsg(null);

      const logoUrl = await uploadLogo(clinic.id);

      const payload = { name: name.trim() };
      if (logoUrl) payload.logo_url = logoUrl;

      const { error } = await supabase
        .from("clinics")
        .update(payload)
        .eq("id", clinic.id);

      if (error) throw error;

      await refreshClinic();
      setLogoFile(null);

      setMsg("✅ Cambios guardados correctamente.");
    } catch (e) {
      setMsg("❌ Error guardando cambios.");
      console.error(e);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="p-6">Cargando…</div>;

  return (
    <div className="p-6 max-w-3xl">
      <h1 className="text-2xl font-bold">App configuration</h1>
      <p className="opacity-70 mb-6">
        Configuración general y estado del sistema.
      </p>

      {/* ================= ENV STATUS ================= */}
      <div className="card mb-6">
        <div className="card-head">
          <strong>Estado del sistema</strong>
        </div>
        <div className="card-body">
          {envStatus.ok ? (
            <div className="hint ok">Todo configurado correctamente ✔</div>
          ) : (
            <div className="hint warn">
              Faltan variables:
              <br />
              <b>{envStatus.missing.join(", ")}</b>
            </div>
          )}
        </div>
      </div>

      {/* ================= BRAND ================= */}
      <div className="card">
        <div className="card-head">
          <strong>Marca de la clínica</strong>
        </div>

        <div className="card-body space-y-4">
          <div>
            <label>Nombre de la clínica</label>
            <input
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: DMC Dental Solution"
            />
          </div>

          <div>
            <label>Logo</label>
            {logoPreview && (
              <img
                src={logoPreview}
                alt="logo"
                style={{ height: 80, marginBottom: 10 }}
              />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                setLogoFile(file);
                setLogoPreview(URL.createObjectURL(file));
              }}
            />
          </div>

          <div className="flex gap-2">
            <button
              className="btn-primary"
              onClick={onSave}
              disabled={saving}
            >
              {saving ? "Guardando…" : "Guardar cambios"}
            </button>

            <button
              className="btn-secondary"
              onClick={() => {
                setName(clinic?.name || "");
                setLogoPreview(clinic?.logo_url || null);
                setLogoFile(null);
                setMsg(null);
              }}
            >
              Descartar
            </button>
          </div>

          {msg && <div className="mt-2">{msg}</div>}
        </div>
      </div>
    </div>
  );
}
