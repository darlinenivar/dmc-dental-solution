import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import "../styles/patient-profile.css";

function fmtDate(d) {
  if (!d) return "";
  try {
    return new Date(d).toISOString().slice(0, 10);
  } catch {
    return d;
  }
}

export default function PacientePerfil() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [patient, setPatient] = useState(null);

  // form editable
  const [form, setForm] = useState({
    full_name: "",
    first_name: "",
    last_name: "",
    birth_date: "",
    gender: "",
    phone: "",
    emergency_phone: "",
    email: "",
    address: "",
    notes: "",
  });

  const displayName = useMemo(() => {
    return (
      form.full_name ||
      `${form.first_name || ""} ${form.last_name || ""}`.trim() ||
      patient?.full_name ||
      `${patient?.first_name || ""} ${patient?.last_name || ""}`.trim() ||
      "Paciente"
    );
  }, [form, patient]);

  async function load() {
    setLoading(true);
    const { data, error } = await supabase
      .from("patients")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error(error);
      alert("Paciente no encontrado.");
      navigate("/my-clinic/patients", { replace: true });
      return;
    }

    setPatient(data);

    setForm({
      full_name: data.full_name || "",
      first_name: data.first_name || "",
      last_name: data.last_name || "",
      birth_date: fmtDate(data.birth_date),
      gender: data.gender || "",
      phone: data.phone || "",
      emergency_phone: data.emergency_phone || "",
      email: data.email || "",
      address: data.address || "",
      notes: data.notes || "",
    });

    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const go = (path) => navigate(path);

  const onPrint = () => window.print();

  const onSave = async () => {
    setSaving(true);

    // soporta tu tabla aunque use full_name o first/last
    const payload = {
      full_name: form.full_name || null,
      first_name: form.first_name || null,
      last_name: form.last_name || null,
      birth_date: form.birth_date ? form.birth_date : null,
      gender: form.gender || null,
      phone: form.phone || null,
      emergency_phone: form.emergency_phone || null,
      email: form.email || null,
      address: form.address || null,
      notes: form.notes || null,
    };

    const { error } = await supabase.from("patients").update(payload).eq("id", id);

    if (error) {
      console.error(error);
      alert("No se pudo guardar.");
      setSaving(false);
      return;
    }

    await load();
    setSaving(false);
    alert("✅ Guardado.");
  };

  if (loading) {
    return (
      <div className="page">
        <div className="card">
          <div className="empty">Cargando...</div>
        </div>
      </div>
    );
  }

  if (!patient) return null;

  return (
    <div className="page patient-detail">
      {/* Header */}
      <div className="profile-head">
        <div>
          <h1 className="profile-title">{displayName}</h1>
          <div className="muted">
            Perfil del paciente • <b>Editable</b>
          </div>
        </div>

        <div className="profile-actions no-print">
          <button className="btn" onClick={() => go(`/my-clinic/patients/${id}`)}>
            Ver (solo lectura)
          </button>

          <button className="btn btn-primary" onClick={onSave} disabled={saving}>
            {saving ? "Guardando..." : "Guardar"}
          </button>

          <button className="btn" onClick={onPrint}>🖨 Imprimir</button>

          <button className="btn-ghost" onClick={() => go("/my-clinic/patients")}>
            ← Volver
          </button>
        </div>
      </div>

      {/* Botones pro (modo edit) */}
      <div className="patient-actions-bar no-print">
        <button className="pbtn" onClick={() => go(`/my-clinic/patients/${id}/historia?mode=edit`)}>
          📝 Historia clínica
        </button>
        <button className="pbtn" onClick={() => go(`/my-clinic/patients/${id}/citas?mode=edit`)}>
          📅 Citas
        </button>
        <button className="pbtn" onClick={() => go(`/my-clinic/patients/${id}/odontogramas?mode=edit`)}>
          🦷 Odontogramas
        </button>
        <button className="pbtn" onClick={() => go(`/my-clinic/patients/${id}/facturas?mode=edit`)}>
          🧾 Facturas
        </button>
        <button className="pbtn" onClick={() => go(`/my-clinic/patients/${id}/seguro?mode=edit`)}>
          🛡️ Seguro médico
        </button>
        <button className="pbtn" onClick={() => go(`/my-clinic/patients/${id}/medicamentos?mode=edit`)}>
          💊 Medicamentos
        </button>

        {/* Timeline clínico */}
        <button className="pbtn pbtn-strong" onClick={() => go(`/patients/${id}/timeline`)}>
          🧠 Timeline clínico
        </button>
      </div>

      {/* Form editable */}
      <div className="grid-2">
        <div className="card profile-card">
          <div className="card-title">Información general</div>

          <div className="form-grid">
            {/* Si tú usas full_name solo, este campo te resuelve */}
            <div className="field full">
              <label>Nombre completo</label>
              <input
                className="input"
                value={form.full_name}
                onChange={(e) => setForm((p) => ({ ...p, full_name: e.target.value }))}
                placeholder="Ej: Darline Nivar"
              />
              <div className="hint">Si prefieres, puedes llenar Nombre y Apellido abajo.</div>
            </div>

            <div className="field">
              <label>Nombre</label>
              <input
                className="input"
                value={form.first_name}
                onChange={(e) => setForm((p) => ({ ...p, first_name: e.target.value }))}
                placeholder="Ej: Darline"
              />
            </div>

            <div className="field">
              <label>Apellido</label>
              <input
                className="input"
                value={form.last_name}
                onChange={(e) => setForm((p) => ({ ...p, last_name: e.target.value }))}
                placeholder="Ej: Nivar"
              />
            </div>

            <div className="field">
              <label>Fecha nacimiento</label>
              <input
                className="input"
                type="date"
                value={form.birth_date}
                onChange={(e) => setForm((p) => ({ ...p, birth_date: e.target.value }))}
              />
            </div>

            <div className="field">
              <label>Género</label>
              <select
                className="input"
                value={form.gender}
                onChange={(e) => setForm((p) => ({ ...p, gender: e.target.value }))}
              >
                <option value="">—</option>
                <option value="Femenino">Femenino</option>
                <option value="Masculino">Masculino</option>
                <option value="Otro">Otro</option>
              </select>
            </div>

            <div className="field">
              <label>Teléfono</label>
              <input
                className="input"
                value={form.phone}
                onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                placeholder="809..."
              />
            </div>

            <div className="field">
              <label>Emergencia</label>
              <input
                className="input"
                value={form.emergency_phone}
                onChange={(e) => setForm((p) => ({ ...p, emergency_phone: e.target.value }))}
                placeholder="Contacto emergencia"
              />
            </div>

            <div className="field">
              <label>Email</label>
              <input
                className="input"
                value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                placeholder="email@..."
              />
            </div>

            <div className="field full">
              <label>Dirección</label>
              <input
                className="input"
                value={form.address}
                onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))}
                placeholder="Dirección"
              />
            </div>

            <div className="field full">
              <label>Notas</label>
              <textarea
                className="textarea"
                rows={5}
                value={form.notes}
                onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
                placeholder="Notas del paciente…"
              />
            </div>
          </div>
        </div>

        {/* Panel resumen */}
        <div className="card">
          <div className="card-title">Resumen</div>

          <div className="info-grid">
            <InfoRow label="Paciente ID" value={id} />
            <InfoRow label="Nacimiento" value={form.birth_date || "—"} />
            <InfoRow label="Género" value={form.gender || "—"} />
            <InfoRow label="Teléfono" value={form.phone || "—"} />
            <InfoRow label="Emergencia" value={form.emergency_phone || "—"} />
          </div>

          <div className="muted" style={{ marginTop: 10 }}>
            Tip: Usa los botones de arriba para completar Historia clínica, Medicamentos,
            Seguro, Odontograma y Facturas.
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="info-row">
      <div className="info-label">{label}</div>
      <div className="info-value">{value}</div>
    </div>
  );
}
