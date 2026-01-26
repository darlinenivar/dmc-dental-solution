import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { getActiveClinicId } from "../lib/clinicStorage";
import "../styles/history.css";

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

export default function PacienteHistoria() {
  const { id: patientId } = useParams();
  const navigate = useNavigate();
  const q = useQuery();

  const mode = q.get("mode") || "read"; // read | edit
  const isRead = mode === "read";
  const clinicId = getActiveClinicId();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [patientName, setPatientName] = useState("Paciente");

  const [form, setForm] = useState({
    medical_conditions: "",
    surgeries: "",
    allergies: "",
    current_meds: "",
    smoker: "",
    alcohol: "",
    pregnancy: "",
    bp: "",
    pulse: "",
    temp: "",
    weight: "",
    diagnosis: "",
    treatment_plan: "",
    prognosis: "",
    notes: "",
  });

  const dirtyRef = useRef(false);
  const timerRef = useRef(null);

  async function loadAll() {
    setLoading(true);

    // paciente (solo para encabezado)
    const p = await supabase
      .from("patients")
      .select("full_name, first_name, last_name")
      .eq("id", patientId)
      .maybeSingle();

    const name =
      p.data?.full_name ||
      `${p.data?.first_name || ""} ${p.data?.last_name || ""}`.trim() ||
      "Paciente";
    setPatientName(name);

    // historia (1 por paciente)
    const h = await supabase
      .from("patient_histories")
      .select("*")
      .eq("patient_id", patientId)
      .maybeSingle();

    if (h.error) {
      console.error(h.error);
      alert("Error cargando historia clínica.");
      setLoading(false);
      return;
    }

    if (!h.data) {
      // si no existe, la creamos “vacía” (solo si hay clínica)
      if (clinicId) {
        const ins = await supabase.from("patient_histories").insert({
          clinic_id: clinicId,
          patient_id: patientId,
        });
        if (ins.error) console.error(ins.error);
      }
      setForm((prev) => ({ ...prev }));
      setLoading(false);
      return;
    }

    // cargar data
    setForm({
      medical_conditions: h.data.medical_conditions || "",
      surgeries: h.data.surgeries || "",
      allergies: h.data.allergies || "",
      current_meds: h.data.current_meds || "",
      smoker: h.data.smoker || "",
      alcohol: h.data.alcohol || "",
      pregnancy: h.data.pregnancy || "",
      bp: h.data.bp || "",
      pulse: h.data.pulse || "",
      temp: h.data.temp || "",
      weight: h.data.weight || "",
      diagnosis: h.data.diagnosis || "",
      treatment_plan: h.data.treatment_plan || "",
      prognosis: h.data.prognosis || "",
      notes: h.data.notes || "",
    });

    setLoading(false);
  }

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patientId]);

  const saveNow = async () => {
    if (isRead) return;
    if (!clinicId) return;

    setSaving(true);
    const { error } = await supabase
      .from("patient_histories")
      .update({ ...form })
      .eq("patient_id", patientId);

    if (error) {
      console.error(error);
      alert("No se pudo guardar historia clínica.");
    }
    dirtyRef.current = false;
    setSaving(false);
  };

  // autosave (solo edit)
  useEffect(() => {
    if (isRead) return;

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      if (dirtyRef.current) saveNow();
    }, 1200);

    return () => clearTimeout(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, isRead]);

  const set = (key, value) => {
    dirtyRef.current = true;
    setForm((p) => ({ ...p, [key]: value }));
  };

  if (loading) return <div className="page"><div className="card">Cargando…</div></div>;

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>Historia clínica</h1>
          <div className="muted">{patientName} • {isRead ? "Solo lectura" : "Editable"} {saving ? "• Guardando…" : ""}</div>
        </div>

        <div className="no-print" style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {isRead ? (
            <button className="btn" onClick={() => navigate(`/my-clinic/patients/${patientId}/historia?mode=edit`)}>
              Modificar
            </button>
          ) : (
            <>
              <button className="btn" onClick={() => navigate(`/my-clinic/patients/${patientId}/historia?mode=read`)}>
                Ver
              </button>
              <button className="btn btn-primary" onClick={saveNow}>Guardar ahora</button>
            </>
          )}

          <button className="btn" onClick={() => window.print()}>🖨 Imprimir</button>
          <button className="btn-ghost" onClick={() => navigate(`/my-clinic/patients/${patientId}`)}>← Volver</button>
        </div>
      </div>

      {!clinicId && !isRead && (
        <div className="alert">
          No hay clínica activa. Crea/selecciona una clínica para guardar.
        </div>
      )}

      <div className="card">
        <h3>Antecedentes</h3>
        <div className="grid-2">
          <Area label="Condiciones médicas" value={form.medical_conditions} disabled={isRead} onChange={(v) => set("medical_conditions", v)} />
          <Area label="Cirugías previas" value={form.surgeries} disabled={isRead} onChange={(v) => set("surgeries", v)} />
          <Area label="Alergias" value={form.allergies} disabled={isRead} onChange={(v) => set("allergies", v)} />
          <Area label="Medicamentos actuales" value={form.current_meds} disabled={isRead} onChange={(v) => set("current_meds", v)} />
        </div>

        <hr className="sep" />

        <h3>Hábitos</h3>
        <div className="grid-3">
          <Field label="Fumador" value={form.smoker} disabled={isRead} onChange={(v) => set("smoker", v)} placeholder="Sí/No" />
          <Field label="Alcohol" value={form.alcohol} disabled={isRead} onChange={(v) => set("alcohol", v)} placeholder="Sí/No" />
          <Field label="Embarazo" value={form.pregnancy} disabled={isRead} onChange={(v) => set("pregnancy", v)} placeholder="Sí/No" />
        </div>

        <hr className="sep" />

        <h3>Signos vitales</h3>
        <div className="grid-4">
          <Field label="Presión" value={form.bp} disabled={isRead} onChange={(v) => set("bp", v)} placeholder="120/80" />
          <Field label="Pulso" value={form.pulse} disabled={isRead} onChange={(v) => set("pulse", v)} placeholder="bpm" />
          <Field label="Temperatura" value={form.temp} disabled={isRead} onChange={(v) => set("temp", v)} placeholder="°C/°F" />
          <Field label="Peso" value={form.weight} disabled={isRead} onChange={(v) => set("weight", v)} placeholder="kg/lb" />
        </div>

        <hr className="sep" />

        <h3>Diagnóstico y plan</h3>
        <div className="grid-2">
          <Area label="Diagnóstico" value={form.diagnosis} disabled={isRead} onChange={(v) => set("diagnosis", v)} />
          <Area label="Plan de tratamiento" value={form.treatment_plan} disabled={isRead} onChange={(v) => set("treatment_plan", v)} />
          <Area label="Pronóstico" value={form.prognosis} disabled={isRead} onChange={(v) => set("prognosis", v)} />
          <Area label="Notas" value={form.notes} disabled={isRead} onChange={(v) => set("notes", v)} />
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, disabled, placeholder }) {
  return (
    <div className="field">
      <label>{label}</label>
      <input disabled={disabled} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function Area({ label, value, onChange, disabled }) {
  return (
    <div className="field">
      <label>{label}</label>
      <textarea disabled={disabled} value={value} rows={4} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}
