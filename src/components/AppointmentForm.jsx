import { useMemo, useState } from "react";

export default function AppointmentForm({ patient, onCancel, onSubmit }) {
  const [form, setForm] = useState({
    fecha: "",
    hora: "",
    doctor: "",
    motivo: "",
    estado: "Programada",
  });

  const errors = useMemo(() => {
    const e = {};
    if (!form.fecha) e.fecha = "Fecha requerida";
    if (!form.hora) e.hora = "Hora requerida";
    if (!form.doctor.trim()) e.doctor = "Doctor requerido";
    if (!form.motivo.trim()) e.motivo = "Motivo requerido";
    return e;
  }, [form]);

  const canSave = Object.keys(errors).length === 0;

  function set(key, value) {
    setForm((p) => ({ ...p, [key]: value }));
  }

  function submit(e) {
    e.preventDefault();
    if (!canSave) return;
    onSubmit(form);
  }

  return (
    <form className="card" onSubmit={submit}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
        <div>
          <div className="card-title">Nueva cita</div>
          <div className="card-text">
            Paciente: <strong>{patient.nombre}</strong>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancelar
          </button>
          <button type="submit" className="btn" disabled={!canSave} style={{ opacity: canSave ? 1 : 0.55 }}>
            Guardar cita
          </button>
        </div>
      </div>

      <div style={{ height: 14 }} />

      <div className="form-grid">
        <Field label="Fecha" required error={errors.fecha}>
          <input type="date" className="input" value={form.fecha} onChange={(e) => set("fecha", e.target.value)} />
        </Field>

        <Field label="Hora" required error={errors.hora}>
          <input type="time" className="input" value={form.hora} onChange={(e) => set("hora", e.target.value)} />
        </Field>

        <Field label="Doctor" required error={errors.doctor}>
          <input className="input" value={form.doctor} onChange={(e) => set("doctor", e.target.value)} placeholder="Ej: Dra. Pérez" />
        </Field>

        <Field label="Estado">
          <select className="input" value={form.estado} onChange={(e) => set("estado", e.target.value)}>
            <option>Programada</option>
            <option>Confirmada</option>
            <option>En sala</option>
            <option>Completada</option>
            <option>Cancelada</option>
          </select>
        </Field>

        <Field label="Motivo" required error={errors.motivo} full>
          <textarea className="input" rows={3} value={form.motivo} onChange={(e) => set("motivo", e.target.value)} placeholder="Ej: Limpieza / Dolor / Caries..." />
        </Field>
      </div>
    </form>
  );
}

function Field({ label, required, error, full, children }) {
  return (
    <div className={full ? "field field-full" : "field"}>
      <div className="label-row">
        <label className="label">
          {label} {required ? <span className="req">*</span> : null}
        </label>
        {error ? <span className="error">{error}</span> : null}
      </div>
      {children}
    </div>
  );
}
