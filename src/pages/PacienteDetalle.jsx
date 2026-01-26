// src/pages/PacienteDetalle.jsx
import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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

export default function PacienteDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [patients, setPatients] = useState(() => loadPatients());
  const patient = useMemo(() => patients.find((p) => p.id === id), [patients, id]);

  const [tab, setTab] = useState("historial"); // historial | citas | odontograma | seguro | meds
  const [edit, setEdit] = useState(false);
  const [draft, setDraft] = useState(() => patient || null);

  function goBack() {
    navigate("/my-clinic/patients");
  }

  function startEdit() {
    setDraft({ ...patient });
    setEdit(true);
  }

  function cancelEdit() {
    setEdit(false);
    setDraft({ ...patient });
  }

  function saveEdit() {
    const next = patients.map((p) =>
      p.id === patient.id ? { ...draft, updatedAt: new Date().toISOString() } : p
    );
    setPatients(next);
    savePatients(next);
    setEdit(false);
  }

  if (!patient) {
    return (
      <div className="page">
        <div className="card">
          <h2>Paciente no encontrado</h2>
          <p className="muted">No existe un paciente con ese ID en este dispositivo (localStorage).</p>
          <button className="btn-primary" onClick={goBack}>Ir a pacientes</button>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Perfil del paciente</h1>
          <p className="muted">{patient.nombre} {patient.apellido} · {patient.genero} · {patient.fechaNacimiento}</p>
        </div>

        <div className="header-actions">
          <button className="btn" onClick={goBack}>Lista de pacientes</button>
          {!edit ? (
            <button className="btn-primary" onClick={startEdit}>Editar</button>
          ) : (
            <>
              <button className="btn" onClick={cancelEdit}>Cancelar</button>
              <button className="btn-primary" onClick={saveEdit}>Guardar</button>
            </>
          )}
        </div>
      </div>

      {/* Card info */}
      <div className="card">
        <div className="form-grid">
          <div className="field">
            <label>Nombre</label>
            <input disabled={!edit} value={edit ? draft.nombre : patient.nombre}
              onChange={(e) => setDraft({ ...draft, nombre: e.target.value })} />
          </div>

          <div className="field">
            <label>Apellido</label>
            <input disabled={!edit} value={edit ? draft.apellido : patient.apellido}
              onChange={(e) => setDraft({ ...draft, apellido: e.target.value })} />
          </div>

          <div className="field">
            <label>Fecha de nacimiento</label>
            <input type="date" disabled={!edit} value={edit ? draft.fechaNacimiento : patient.fechaNacimiento}
              onChange={(e) => setDraft({ ...draft, fechaNacimiento: e.target.value })} />
          </div>

          <div className="field">
            <label>Género</label>
            <input disabled={!edit} value={edit ? draft.genero : patient.genero}
              onChange={(e) => setDraft({ ...draft, genero: e.target.value })} />
          </div>

          <div className="field">
            <label>Contacto</label>
            <input disabled={!edit} value={edit ? draft.contacto : patient.contacto}
              onChange={(e) => setDraft({ ...draft, contacto: e.target.value })} />
          </div>

          <div className="field">
            <label>Contacto emergencia</label>
            <input disabled={!edit} value={edit ? draft.contactoEmergencia : patient.contactoEmergencia}
              onChange={(e) => setDraft({ ...draft, contactoEmergencia: e.target.value })} />
          </div>

          <div className="field full">
            <label>Alergias</label>
            <textarea disabled={!edit} value={edit ? draft.alergias : patient.alergias}
              onChange={(e) => setDraft({ ...draft, alergias: e.target.value })} />
          </div>

          <div className="field">
            <label>Email</label>
            <input disabled={!edit} value={edit ? (draft.email || "") : (patient.email || "")}
              onChange={(e) => setDraft({ ...draft, email: e.target.value })} />
          </div>

          <div className="field full">
            <label>Nota</label>
            <textarea disabled={!edit} value={edit ? (draft.nota || "") : (patient.nota || "")}
              onChange={(e) => setDraft({ ...draft, nota: e.target.value })} />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="card">
        <div className="tabs">
          <button className={tab === "historial" ? "tab active" : "tab"} onClick={() => setTab("historial")}>Historial clínico</button>
          <button className={tab === "citas" ? "tab active" : "tab"} onClick={() => setTab("citas")}>Citas</button>
          <button className={tab === "odontograma" ? "tab active" : "tab"} onClick={() => setTab("odontograma")}>Odontograma</button>
          <button className={tab === "seguro" ? "tab active" : "tab"} onClick={() => setTab("seguro")}>Seguro médico</button>
          <button className={tab === "meds" ? "tab active" : "tab"} onClick={() => setTab("meds")}>Medicamentos</button>
        </div>

        <div className="tab-body">
          {tab === "historial" && <p className="muted">Aquí va el formulario de antecedentes y anamnesis (fase 2). Lo hacemos después de Citas.</p>}
          {tab === "citas" && <p className="muted">Aquí veremos las citas del paciente y un botón “Nueva cita”.</p>}
          {tab === "odontograma" && <p className="muted">Aquí va el odontograma asociado a este paciente.</p>}
          {tab === "seguro" && <p className="muted">Aquí van datos del seguro/plan del paciente.</p>}
          {tab === "meds" && <p className="muted">Aquí van medicamentos y alergias (ya tienes alergias arriba).</p>}
        </div>
      </div>
    </div>
  );
}
