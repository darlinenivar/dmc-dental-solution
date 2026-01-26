// src/pages/Pacientes.jsx
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/pacientes.css";

const LS_PATIENTS = "dmc_patients_v1";

function loadPatients() {
  try {
    const raw = localStorage.getItem(LS_PATIENTS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function savePatients(list) {
  localStorage.setItem(LS_PATIENTS, JSON.stringify(list));
}

function makeId() {
  return crypto?.randomUUID ? crypto.randomUUID() : String(Date.now());
}

export default function Pacientes() {
  const navigate = useNavigate();
  const [patients, setPatients] = useState(() => loadPatients());
  const [q, setQ] = useState("");
  const [showNew, setShowNew] = useState(false);

  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    fechaNacimiento: "",
    genero: "",
    contacto: "",
    contactoEmergencia: "",
    alergias: "",
    email: "",
    nota: "",
  });

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return patients;
    return patients.filter((p) => {
      const hay = `${p.nombre} ${p.apellido} ${p.contacto} ${p.email || ""}`.toLowerCase();
      return hay.includes(s);
    });
  }, [patients, q]);

  function resetForm() {
    setForm({
      nombre: "",
      apellido: "",
      fechaNacimiento: "",
      genero: "",
      contacto: "",
      contactoEmergencia: "",
      alergias: "",
      email: "",
      nota: "",
    });
  }

  function validate() {
    // obligatorios:
    const required = ["nombre", "apellido", "fechaNacimiento", "genero", "contacto", "contactoEmergencia", "alergias"];
    for (const k of required) {
      if (!String(form[k] || "").trim()) return false;
    }
    return true;
  }

  function onCreate() {
    if (!validate()) {
      alert("Completa los campos obligatorios (*)");
      return;
    }

    const newPatient = {
      id: makeId(), // por ahora local; en Supabase será id de la tabla
      ...form,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const next = [newPatient, ...patients];
    setPatients(next);
    savePatients(next);
    setShowNew(false);
    resetForm();

    // ir al perfil
    navigate(`/my-clinic/patients/${newPatient.id}`);
  }

  function goToPatient(p) {
    navigate(`/my-clinic/patients/${p.id}`);
  }

  function removePatient(id) {
    if (!confirm("¿Eliminar este paciente?")) return;
    const next = patients.filter((p) => p.id !== id);
    setPatients(next);
    savePatients(next);
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Pacientes</h1>
          <p className="muted">Total: {patients.length} · Mostrando: {filtered.length}</p>
        </div>

        <div className="header-actions">
          <div className="search">
            <input
              className="search-input"
              placeholder="Buscar por nombre, apellido, contacto, email…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>

          <button className="btn-primary" onClick={() => setShowNew(true)}>
            + Nuevo
          </button>
        </div>
      </div>

      <div className="card">
        <div className="table">
          <div className="row head">
            <div>Paciente</div>
            <div>Fecha nac.</div>
            <div>Género</div>
            <div>Contacto</div>
            <div className="right">Acciones</div>
          </div>

          {filtered.length === 0 ? (
            <div className="empty">No hay pacientes todavía.</div>
          ) : (
            filtered.map((p) => (
              <div className="row" key={p.id}>
                <div className="patient-cell" onClick={() => goToPatient(p)} role="button" tabIndex={0}>
                  <div className="avatar">{(p.nombre?.[0] || "P").toUpperCase()}{(p.apellido?.[0] || "").toUpperCase()}</div>
                  <div>
                    <div className="name">{p.nombre} {p.apellido}</div>
                    <div className="sub muted">Emergencia: {p.contactoEmergencia}</div>
                  </div>
                </div>

                <div>{p.fechaNacimiento || "-"}</div>
                <div>{p.genero || "-"}</div>
                <div>{p.contacto || "-"}</div>

                <div className="right actions">
                  <button className="btn" onClick={() => goToPatient(p)}>Ver</button>
                  <button className="btn danger" onClick={() => removePatient(p.id)}>Eliminar</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal nuevo paciente */}
      {showNew && (
        <div className="modal-backdrop" onMouseDown={() => setShowNew(false)}>
          <div className="modal" onMouseDown={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Nuevo paciente</h2>
              <button className="icon-btn" onClick={() => setShowNew(false)}>✕</button>
            </div>

            <div className="form-grid">
              <div className="field">
                <label>Nombre *</label>
                <input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
              </div>

              <div className="field">
                <label>Apellido *</label>
                <input value={form.apellido} onChange={(e) => setForm({ ...form, apellido: e.target.value })} />
              </div>

              <div className="field">
                <label>Fecha de nacimiento *</label>
                <input type="date" value={form.fechaNacimiento} onChange={(e) => setForm({ ...form, fechaNacimiento: e.target.value })} />
              </div>

              <div className="field">
                <label>Género *</label>
                <select value={form.genero} onChange={(e) => setForm({ ...form, genero: e.target.value })}>
                  <option value="">Seleccionar</option>
                  <option value="Femenino">Femenino</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>

              <div className="field">
                <label>Contacto *</label>
                <input value={form.contacto} onChange={(e) => setForm({ ...form, contacto: e.target.value })} placeholder="Ej: 809 000 0000" />
              </div>

              <div className="field">
                <label>Contacto de emergencia *</label>
                <input value={form.contactoEmergencia} onChange={(e) => setForm({ ...form, contactoEmergencia: e.target.value })} placeholder="Ej: 809 000 0000" />
              </div>

              <div className="field full">
                <label>Alergias *</label>
                <textarea value={form.alergias} onChange={(e) => setForm({ ...form, alergias: e.target.value })} placeholder="Ej: Penicilina, látex…" />
              </div>

              <div className="field">
                <label>Email</label>
                <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="opcional" />
              </div>

              <div className="field full">
                <label>Nota</label>
                <textarea value={form.nota} onChange={(e) => setForm({ ...form, nota: e.target.value })} placeholder="opcional" />
              </div>
            </div>

            <div className="modal-actions">
              <button className="btn" onClick={() => { setShowNew(false); resetForm(); }}>Cancelar</button>
              <button className="btn-primary" onClick={onCreate}>Guardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
