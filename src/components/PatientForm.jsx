// src/components/PatientForm.jsx
import React, { useEffect, useMemo, useState } from "react";

const GENDER_OPTIONS = [
  { value: "Masculino", label: "Masculino" },
  { value: "Femenino", label: "Femenino" },
  { value: "Otro", label: "Otro" },
];

const emptyForm = {
  nombre: "",
  apellido: "",
  fechaNacimiento: "",
  genero: "",
  contacto: "",
  emergenciaNombre: "",
  emergenciaTelefono: "",
  alergias: "",
  email: "",
  nota: "",
};

function normalizePhone(v) {
  // deja numeros, +, espacios, guiones, parentesis
  return (v || "").replace(/[^\d+\-\s()]/g, "");
}

function isValidEmail(email) {
  if (!email) return true; // email NO obligatorio
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export default function PatientForm({
  open,
  onClose,
  onSave,      // recomendado
  onSubmit,    // compatibilidad si lo usabas asi
  initialValue // para editar (opcional)
}) {
  const [form, setForm] = useState(emptyForm);
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState("idle"); // idle | saving | saved | error
  const [hasChanges, setHasChanges] = useState(false);

  // Cargar valores iniciales (nuevo / editar)
  useEffect(() => {
    if (!open) return;
    const base = initialValue ? { ...emptyForm, ...initialValue } : emptyForm;
    setForm(base);
    setTouched({});
    setStatus("idle");
    setHasChanges(false);
  }, [open, initialValue]);

  const errors = useMemo(() => {
    const e = {};

    // obligatorios
    if (!form.nombre.trim()) e.nombre = "El nombre es obligatorio.";
    if (!form.apellido.trim()) e.apellido = "El apellido es obligatorio.";
    if (!form.fechaNacimiento) e.fechaNacimiento = "La fecha de nacimiento es obligatoria.";
    if (!form.genero) e.genero = "El género es obligatorio.";
    if (!form.contacto.trim()) e.contacto = "El contacto es obligatorio.";
    if (!form.emergenciaNombre.trim()) e.emergenciaNombre = "El nombre del contacto de emergencia es obligatorio.";
    if (!form.emergenciaTelefono.trim()) e.emergenciaTelefono = "El teléfono de emergencia es obligatorio.";
    if (!form.alergias.trim()) e.alergias = "Alergias es obligatorio (si no tiene, escribe “Ninguna”).";

    // formatos
    if (form.contacto && normalizePhone(form.contacto).length < 7) {
      e.contacto = "Escribe un teléfono válido.";
    }
    if (form.emergenciaTelefono && normalizePhone(form.emergenciaTelefono).length < 7) {
      e.emergenciaTelefono = "Escribe un teléfono válido.";
    }
    if (!isValidEmail(form.email)) e.email = "Email inválido.";

    return e;
  }, [form]);

  const canSave = useMemo(() => Object.keys(errors).length === 0, [errors]);

  function markTouched(name) {
    setTouched((p) => ({ ...p, [name]: true }));
  }

  function setField(name, value) {
    setHasChanges(true);
    setStatus("idle");
    setForm((p) => ({ ...p, [name]: value }));
  }

  async function handleSave() {
    // marcar todo tocado para mostrar errores
    const all = Object.keys(emptyForm).reduce((acc, k) => ({ ...acc, [k]: true }), {});
    setTouched(all);

    if (!canSave) {
      setStatus("error");
      return;
    }

    try {
      setStatus("saving");

      const payload = {
        ...form,
        contacto: normalizePhone(form.contacto),
        emergenciaTelefono: normalizePhone(form.emergenciaTelefono),
        updatedAt: new Date().toISOString(),
        createdAt: form.createdAt || new Date().toISOString(),
        id: form.id || crypto.randomUUID(),
      };

      // soporta onSave o onSubmit
      const fn = onSave || onSubmit;
      if (typeof fn === "function") {
        await fn(payload);
      }

      setStatus("saved");
      setHasChanges(false);

      // auto-cerrar suave
      setTimeout(() => {
        if (typeof onClose === "function") onClose();
      }, 650);
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  }

  function tryClose() {
    // Bloqueo si no está guardado (solo si hay cambios)
    if (hasChanges && status !== "saved") {
      const ok = window.confirm("Tienes cambios sin guardar. ¿Deseas salir sin guardar?");
      if (!ok) return;
    }
    if (typeof onClose === "function") onClose();
  }

  if (!open) return null;

  return (
    <div className="modalOverlay" role="dialog" aria-modal="true">
      <div className="modalCard">
        <div className="modalHeader">
          <div>
            <h2 className="modalTitle">Nuevo paciente</h2>
            <p className="modalSub">
              Completa los campos obligatorios (<span className="req">*</span>) para guardar.
            </p>
          </div>

          <div className="modalHeaderRight">
            {status === "saved" && <span className="pillOk">Guardado ✅</span>}
            {status === "saving" && <span className="pill">Guardando…</span>}
            {status === "error" && <span className="pillWarn">Revisa los campos</span>}
            <button className="iconBtn" onClick={tryClose} aria-label="Cerrar">
              ✕
            </button>
          </div>
        </div>

        <div className="modalBody">
          {/* GRID 2 columnas */}
          <div className="grid2">
            {/* Nombre */}
            <Field
              label="Nombre"
              required
              value={form.nombre}
              onChange={(v) => setField("nombre", v)}
              onBlur={() => markTouched("nombre")}
              error={touched.nombre ? errors.nombre : ""}
              placeholder="Ej: Darline"
            />

            {/* Apellido */}
            <Field
              label="Apellido"
              required
              value={form.apellido}
              onChange={(v) => setField("apellido", v)}
              onBlur={() => markTouched("apellido")}
              error={touched.apellido ? errors.apellido : ""}
              placeholder="Ej: Nivar"
            />

            {/* Fecha nacimiento */}
            <Field
              label="Fecha de nacimiento"
              required
              type="date"
              value={form.fechaNacimiento}
              onChange={(v) => setField("fechaNacimiento", v)}
              onBlur={() => markTouched("fechaNacimiento")}
              error={touched.fechaNacimiento ? errors.fechaNacimiento : ""}
            />

            {/* Género */}
            <SelectField
              label="Género"
              required
              value={form.genero}
              onChange={(v) => setField("genero", v)}
              onBlur={() => markTouched("genero")}
              error={touched.genero ? errors.genero : ""}
              options={GENDER_OPTIONS}
              placeholder="Seleccionar"
            />

            {/* Contacto */}
            <Field
              label="Contacto"
              required
              value={form.contacto}
              onChange={(v) => setField("contacto", v)}
              onBlur={() => markTouched("contacto")}
              error={touched.contacto ? errors.contacto : ""}
              placeholder="Ej: 809 555 1234"
            />

            {/* Email */}
            <Field
              label="Email"
              value={form.email}
              onChange={(v) => setField("email", v)}
              onBlur={() => markTouched("email")}
              error={touched.email ? errors.email : ""}
              placeholder="Ej: correo@clinica.com"
            />

            {/* Emergencia nombre */}
            <Field
              label="Contacto de emergencia (Nombre)"
              required
              value={form.emergenciaNombre}
              onChange={(v) => setField("emergenciaNombre", v)}
              onBlur={() => markTouched("emergenciaNombre")}
              error={touched.emergenciaNombre ? errors.emergenciaNombre : ""}
              placeholder="Ej: Madre / Esposo"
            />

            {/* Emergencia teléfono */}
            <Field
              label="Contacto de emergencia (Teléfono)"
              required
              value={form.emergenciaTelefono}
              onChange={(v) => setField("emergenciaTelefono", v)}
              onBlur={() => markTouched("emergenciaTelefono")}
              error={touched.emergenciaTelefono ? errors.emergenciaTelefono : ""}
              placeholder="Ej: 809 555 9876"
            />
          </div>

          {/* Alergias + Nota */}
          <div className="grid1">
            <div className="rowHeader">
              <label className="label">
                Alergias <span className="req">*</span>
              </label>
              <button
                type="button"
                className="linkBtn"
                onClick={() => setField("alergias", "Ninguna")}
              >
                Marcar “Ninguna”
              </button>
            </div>
            <textarea
              className={`textarea ${touched.alergias && errors.alergias ? "inputError" : ""}`}
              value={form.alergias}
              onChange={(e) => setField("alergias", e.target.value)}
              onBlur={() => markTouched("alergias")}
              placeholder="Ej: Penicilina, látex, anestesia… (si no tiene, escribe: Ninguna)"
              rows={3}
            />
            {touched.alergias && errors.alergias ? <div className="error">{errors.alergias}</div> : null}

            <label className="label">Nota</label>
            <textarea
              className="textarea"
              value={form.nota}
              onChange={(e) => setField("nota", e.target.value)}
              placeholder="Observaciones / notas clínicas…"
              rows={3}
            />
          </div>
        </div>

        <div className="modalFooter">
          <button className="btnGhost" onClick={tryClose}>
            Cancelar
          </button>

          <button
            className="btnPrimary"
            onClick={handleSave}
            disabled={!canSave || status === "saving"}
            title={!canSave ? "Completa los campos obligatorios" : "Guardar paciente"}
          >
            {status === "saving" ? "Guardando…" : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- UI helpers ---------- */

function Field({ label, required, value, onChange, onBlur, error, placeholder, type = "text" }) {
  return (
    <div className="field">
      <label className="label">
        {label} {required ? <span className="req">*</span> : null}
      </label>
      <input
        className={`input ${error ? "inputError" : ""}`}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
      />
      {error ? <div className="error">{error}</div> : null}
    </div>
  );
}

function SelectField({ label, required, value, onChange, onBlur, error, options, placeholder }) {
  return (
    <div className="field">
      <label className="label">
        {label} {required ? <span className="req">*</span> : null}
      </label>
      <select
        className={`input ${error ? "inputError" : ""}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
      >
        <option value="">{placeholder || "Seleccionar"}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {error ? <div className="error">{error}</div> : null}
    </div>
  );
}
