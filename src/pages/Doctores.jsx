import React, { useEffect, useMemo, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import "../styles/doctores.css";

import {
  loadDoctors,
  saveDoctors,
  setActiveDoctorId,
  getActiveDoctorId,
} from "../lib/doctorStore";

function uid() {
  return crypto?.randomUUID?.() || String(Date.now()) + Math.random().toString(16).slice(2);
}

const EMPTY_DOCTOR = () => ({
  id: uid(),
  first_name: "",
  last_name: "",
  specialty: "Odontología general",
  license: "",
  phone: "",
  email: "",
  address: "",
  note: "",
  signaturePng: "",
  createdAt: new Date().toISOString(),
});

export default function Doctores() {
  const [doctors, setDoctors] = useState(() => loadDoctors());
  const [activeId, setActiveId] = useState(() => getActiveDoctorId());
  const [openNew, setOpenNew] = useState(false);
  const [draft, setDraft] = useState(EMPTY_DOCTOR());

  const activeDoctor = useMemo(() => {
    const found = doctors.find((d) => d.id === activeId);
    return found || doctors[0] || null;
  }, [doctors, activeId]);

  // persist
  useEffect(() => {
    saveDoctors(doctors);
    if (activeId) setActiveDoctorId(activeId);
  }, [doctors, activeId]);

  // si no hay active, asigna el primero
  useEffect(() => {
    if (!activeId && doctors.length) setActiveId(doctors[0].id);
  }, [activeId, doctors]);

  const updateActive = (patch) => {
    if (!activeDoctor) return;
    setDoctors((prev) =>
      prev.map((d) => (d.id === activeDoctor.id ? { ...d, ...patch } : d))
    );
  };

  const onNewDoctor = () => {
    setDraft(EMPTY_DOCTOR());
    setOpenNew(true);
  };

  const createDoctor = () => {
    if (!draft.first_name.trim() || !draft.last_name.trim()) {
      alert("Nombre y apellido son obligatorios.");
      return;
    }
    setDoctors((prev) => [draft, ...prev]);
    setActiveId(draft.id);
    setOpenNew(false);
  };

  const deleteActive = () => {
    if (!activeDoctor) return;
    const ok = confirm("¿Eliminar este doctor?");
    if (!ok) return;

    setDoctors((prev) => prev.filter((d) => d.id !== activeDoctor.id));
    setActiveId("");
  };

  return (
    <div className="doctors-page">
      <div className="doctors-head">
        <div>
          <h1>Doctor/a</h1>
          <div className="muted">
            Configura el perfil del doctor/a y la firma para recetas, facturas y consentimiento.
          </div>
        </div>

        <div className="doctors-actions">
          <button className="btn" onClick={onNewDoctor}>+ Nuevo doctor</button>
          <button className="btn-danger" onClick={deleteActive} disabled={!activeDoctor}>
            Eliminar
          </button>
          <button
            className="btn-primary"
            onClick={() => alert("✅ Guardado automático (LocalStorage).")}
            disabled={!activeDoctor}
          >
            Guardar
          </button>
        </div>
      </div>

      <div className="row" style={{ marginBottom: 10 }}>
        <span className="pill">Local</span>
        <div className="muted">Doctor activo:</div>

        <select
          className="select"
          value={activeDoctor?.id || ""}
          onChange={(e) => setActiveId(e.target.value)}
          style={{ maxWidth: 320 }}
        >
          {doctors.map((d) => (
            <option key={d.id} value={d.id}>
              {d.first_name || "—"} {d.last_name || ""}
            </option>
          ))}
        </select>
      </div>

      <div className="doctors-grid">
        {/* Info doctor */}
        <div className="card">
          <h2>Información del doctor</h2>

          {!activeDoctor ? (
            <div className="muted">No hay doctores. Crea uno con “Nuevo doctor”.</div>
          ) : (
            <>
              <div className="form-grid">
                <div>
                  <label className="label">Nombre *</label>
                  <input
                    className="input"
                    value={activeDoctor.first_name}
                    onChange={(e) => updateActive({ first_name: e.target.value })}
                    placeholder="Ej: Ana"
                  />
                </div>

                <div>
                  <label className="label">Apellido *</label>
                  <input
                    className="input"
                    value={activeDoctor.last_name}
                    onChange={(e) => updateActive({ last_name: e.target.value })}
                    placeholder="Ej: Nivar"
                  />
                </div>

                <div>
                  <label className="label">Especialidad</label>
                  <input
                    className="input"
                    value={activeDoctor.specialty}
                    onChange={(e) => updateActive({ specialty: e.target.value })}
                    placeholder="Odontología general"
                  />
                </div>

                <div>
                  <label className="label">Licencia / Colegiatura</label>
                  <input
                    className="input"
                    value={activeDoctor.license}
                    onChange={(e) => updateActive({ license: e.target.value })}
                    placeholder="Ej: COD-12345"
                  />
                </div>

                <div>
                  <label className="label">Teléfono</label>
                  <input
                    className="input"
                    value={activeDoctor.phone}
                    onChange={(e) => updateActive({ phone: e.target.value })}
                    placeholder="809..."
                  />
                </div>

                <div>
                  <label className="label">Email</label>
                  <input
                    className="input"
                    value={activeDoctor.email}
                    onChange={(e) => updateActive({ email: e.target.value })}
                    placeholder="clinic@email.com"
                  />
                </div>
              </div>

              <div style={{ marginTop: 10 }}>
                <label className="label">Dirección</label>
                <input
                  className="input"
                  value={activeDoctor.address}
                  onChange={(e) => updateActive({ address: e.target.value })}
                  placeholder="Ej: Santo Domingo, RD"
                />
              </div>

              <div style={{ marginTop: 10 }}>
                <label className="label">Nota</label>
                <textarea
                  className="textarea"
                  value={activeDoctor.note}
                  onChange={(e) => updateActive({ note: e.target.value })}
                  placeholder="Ej: horarios, observaciones..."
                />
              </div>
            </>
          )}
        </div>

        {/* Firma */}
        <DoctorSignatureCard
          doctor={activeDoctor}
          onChange={(patch) => updateActive(patch)}
        />
      </div>

      {/* MODAL NUEVO DOCTOR (tipo paciente) */}
      {openNew && (
        <div className="modal-overlay" onMouseDown={() => setOpenNew(false)}>
          <div className="modal" onMouseDown={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <strong>Nuevo doctor</strong>
              <button className="btn" onClick={() => setOpenNew(false)}>✕</button>
            </div>

            <div className="modal-body">
              <div className="form-grid">
                <div>
                  <label className="label">Nombre *</label>
                  <input
                    className="input"
                    value={draft.first_name}
                    onChange={(e) => setDraft((p) => ({ ...p, first_name: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="label">Apellido *</label>
                  <input
                    className="input"
                    value={draft.last_name}
                    onChange={(e) => setDraft((p) => ({ ...p, last_name: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="label">Especialidad</label>
                  <input
                    className="input"
                    value={draft.specialty}
                    onChange={(e) => setDraft((p) => ({ ...p, specialty: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="label">Licencia</label>
                  <input
                    className="input"
                    value={draft.license}
                    onChange={(e) => setDraft((p) => ({ ...p, license: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="label">Teléfono</label>
                  <input
                    className="input"
                    value={draft.phone}
                    onChange={(e) => setDraft((p) => ({ ...p, phone: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="label">Email</label>
                  <input
                    className="input"
                    value={draft.email}
                    onChange={(e) => setDraft((p) => ({ ...p, email: e.target.value }))}
                  />
                </div>
              </div>

              <div style={{ marginTop: 10 }}>
                <label className="label">Dirección</label>
                <input
                  className="input"
                  value={draft.address}
                  onChange={(e) => setDraft((p) => ({ ...p, address: e.target.value }))}
                />
              </div>

              <div style={{ marginTop: 10 }}>
                <label className="label">Nota</label>
                <textarea
                  className="textarea"
                  value={draft.note}
                  onChange={(e) => setDraft((p) => ({ ...p, note: e.target.value }))}
                />
              </div>
            </div>

            <div className="modal-foot">
              <button className="btn" onClick={() => setOpenNew(false)}>
                Cancelar
              </button>
              <button className="btn-primary" onClick={createDoctor}>
                Crear doctor
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DoctorSignatureCard({ doctor, onChange }) {
  const [sig, setSig] = useState(null);

  const onClear = () => {
    sig?.clear();
    onChange({ signaturePng: "" });
  };

  const onUndo = () => {
    if (!sig) return;
    const data = sig.toData();
    data.pop();
    sig.fromData(data);
    onChange({ signaturePng: sig.isEmpty() ? "" : sig.toDataURL("image/png") });
  };

  const onEnd = () => {
    if (!sig) return;
    const png = sig.isEmpty() ? "" : sig.toDataURL("image/png");
    onChange({ signaturePng: png });
  };

  useEffect(() => {
    if (!sig) return;
    // cargar firma guardada al cambiar doctor
    sig.clear();
    if (doctor?.signaturePng) {
      const img = new Image();
      img.onload = () => {
        const ctx = sig.getCanvas().getContext("2d");
        ctx.drawImage(img, 0, 0);
      };
      img.src = doctor.signaturePng;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doctor?.id, sig]);

  return (
    <div className="card">
      <div className="row-between">
        <h2>Firma</h2>
        <span className="muted">{doctor ? `${doctor.first_name} ${doctor.last_name}` : ""}</span>
      </div>

      {!doctor ? (
        <div className="muted">Crea un doctor para poder firmar.</div>
      ) : (
        <>
          <div className="sig-toolbar">
            <button className="btn" onClick={onUndo}>Deshacer</button>
            <button className="btn-danger" onClick={onClear}>Limpiar</button>
            <span className="muted">Dibuja con mouse o dedo (si te sales un poco, la firma sigue).</span>
          </div>

          <div className="sig-wrap">
            <SignatureCanvas
              ref={(r) => setSig(r)}
              canvasProps={{ className: "sig-canvas" }}
              onEnd={onEnd}
              penColor="#111"
              minWidth={1.6}
              maxWidth={3.2}
              dotSize={1.2}
              velocityFilterWeight={0.7}
            />
          </div>
        </>
      )}
    </div>
  );
}
