import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import "../styles/myclinic.css";

export default function MyClinic() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [clinic, setClinic] = useState(null);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    legal_name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    country: "RD",
    rnc: "",
    website: "",
    notes: "",
  });

  useEffect(() => {
    let alive = true;

    async function load() {
      setLoading(true);
      setError("");

      const { data: auth } = await supabase.auth.getUser();
      const user = auth?.user;
      if (!user) {
        setError("Debes iniciar sesión.");
        setLoading(false);
        return;
      }

      const { data, error: e } = await supabase
        .from("clinics")
        .select("*")
        .eq("owner_id", user.id)
        .maybeSingle();

      if (!alive) return;

      if (e) {
        setError(e.message);
        setLoading(false);
        return;
      }

      if (data) {
        setClinic(data);
        setForm({
          name: data.name ?? "",
          legal_name: data.legal_name ?? "",
          phone: data.phone ?? "",
          email: data.email ?? "",
          address: data.address ?? "",
          city: data.city ?? "",
          country: data.country ?? "RD",
          rnc: data.rnc ?? "",
          website: data.website ?? "",
          notes: data.notes ?? "",
        });
      }

      setLoading(false);
    }

    load();
    return () => {
      alive = false;
    };
  }, []);

  async function save() {
    setSaving(true);
    setError("");

    const { data: auth } = await supabase.auth.getUser();
    const user = auth?.user;
    if (!user) {
      setError("Debes iniciar sesión.");
      setSaving(false);
      return;
    }

    const payload = {
      owner_id: user.id,
      name: form.name.trim(),
      legal_name: form.legal_name.trim() || null,
      phone: form.phone.trim() || null,
      email: form.email.trim() || null,
      address: form.address.trim() || null,
      city: form.city.trim() || null,
      country: form.country || "RD",
      rnc: form.rnc.trim() || null,
      website: form.website.trim() || null,
      notes: form.notes.trim() || null,
    };

    try {
      if (!payload.name) throw new Error("Pon el nombre del consultorio.");

      if (!clinic) {
        const { data, error } = await supabase
          .from("clinics")
          .insert([payload])
          .select("*")
          .single();

        if (error) throw error;
        setClinic(data);
      } else {
        const { data, error } = await supabase
          .from("clinics")
          .update(payload)
          .eq("id", clinic.id)
          .select("*")
          .single();

        if (error) throw error;
        setClinic(data);
      }
    } catch (e) {
      setError(e.message || "No se pudo guardar la clínica.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="page">
      <div className="pageHeader">
        <div>
          <h1>Mi centro / My clinic</h1>
          <p className="muted">Crea tu clínica una sola vez y listo.</p>
        </div>

        <button className="btnPrimary" onClick={save} disabled={saving || loading}>
          {saving ? "Guardando..." : clinic ? "Guardar cambios" : "Crear clínica"}
        </button>
      </div>

      {error ? <div className="alertError">{error}</div> : null}

      <div className="card">
        <div className="grid2">
          <Field label="Nombre del consultorio *">
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </Field>

          <Field label="Nombre legal">
            <input value={form.legal_name} onChange={(e) => setForm({ ...form, legal_name: e.target.value })} />
          </Field>

          <Field label="Teléfono">
            <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </Field>

          <Field label="Correo">
            <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </Field>

          <Field label="Dirección">
            <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          </Field>

          <Field label="Ciudad">
            <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
          </Field>

          <Field label="País">
            <select value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })}>
              <option value="RD">República Dominicana</option>
              <option value="US">Estados Unidos</option>
              <option value="PR">Puerto Rico</option>
              <option value="MX">México</option>
            </select>
          </Field>

          <Field label="RNC">
            <input value={form.rnc} onChange={(e) => setForm({ ...form, rnc: e.target.value })} />
          </Field>

          <Field label="Website">
            <input value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
          </Field>

          <Field label="Notas">
            <textarea rows={5} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </Field>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="field">
      <span className="label">{label}</span>
      {children}
    </label>
  );
}
