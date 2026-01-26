import React, { useEffect, useMemo, useState } from "react";
import "../styles/citas.css";

const LS_KEY = "dmc.appointments.v1";

function startOfDay(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}
function endOfDay(d) {
  const x = new Date(d);
  x.setHours(23, 59, 59, 999);
  return x;
}
function addDays(d, n) {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}
function isoDate(d) {
  const x = new Date(d);
  const y = x.getFullYear();
  const m = String(x.getMonth() + 1).padStart(2, "0");
  const day = String(x.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
function isoTime(d) {
  const x = new Date(d);
  const hh = String(x.getHours()).padStart(2, "0");
  const mm = String(x.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

function loadAppointments() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}
function saveAppointments(list) {
  localStorage.setItem(LS_KEY, JSON.stringify(list));
}

export default function Citas() {
  const [tab, setTab] = useState("dia"); // dia | semana | mes
  const [selectedDate, setSelectedDate] = useState(() => isoDate(new Date()));
  const [appointments, setAppointments] = useState([]);

  // modal
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    paciente: "",
    doctor: "",
    motivo: "",
    fecha: isoDate(new Date()),
    hora: isoTime(new Date()),
    duracionMin: 30,
    estado: "Programada",
    nota: "",
  });

  useEffect(() => {
    const list = loadAppointments();
    setAppointments(list);
  }, []);

  const range = useMemo(() => {
    const d = new Date(selectedDate + "T00:00:00");
    if (tab === "dia") {
      return { from: startOfDay(d), to: endOfDay(d) };
    }
    if (tab === "semana") {
      // Semana = hoy .. +6 días (simple)
      const from = startOfDay(d);
      const to = endOfDay(addDays(d, 6));
      return { from, to };
    }
    // mes
    const from = new Date(d.getFullYear(), d.getMonth(), 1, 0, 0, 0, 0);
    const to = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);
    return { from, to };
  }, [tab, selectedDate]);

  const filtered = useMemo(() => {
    const from = range.from.getTime();
    const to = range.to.getTime();
    return appointments
      .map((a) => ({
        ...a,
        _ts: new Date(a.startAt).getTime(),
      }))
      .filter((a) => a._ts >= from && a._ts <= to)
      .sort((a, b) => a._ts - b._ts);
  }, [appointments, range]);

  function openNew() {
    const now = new Date();
    setForm({
      paciente: "",
      doctor: "",
      motivo: "",
      fecha: selectedDate,
      hora: isoTime(now),
      duracionMin: 30,
      estado: "Programada",
      nota: "",
    });
    setOpen(true);
  }

  function createAppointment(e) {
    e.preventDefault();

    // Validaciones mínimas
    if (!form.paciente.trim()) return alert("Paciente es obligatorio.");
    if (!form.doctor.trim()) return alert("Doctor/a es obligatorio.");
    if (!form.fecha) return alert("Fecha es obligatoria.");
    if (!form.hora) return alert("Hora es obligatoria.");

    const startAt = new Date(`${form.fecha}T${form.hora}:00`);
    const endAt = new Date(startAt.getTime() + Number(form.duracionMin || 30) * 60000);

    const newItem = {
      id: crypto?.randomUUID ? crypto.randomUUID() : String(Date.now()),
      paciente: form.paciente.trim(),
      doctor: form.doctor.trim(),
      motivo: form.motivo.trim(),
      startAt: startAt.toISOString(),
      endAt: endAt.toISOString(),
      estado: form.estado,
      nota: form.nota.trim(),
      createdAt: new Date().toISOString(),
    };

    const next = [newItem, ...appointments];
    setAppointments(next);
    saveAppointments(next);
    setOpen(false);
  }

  function setEstado(id, estado) {
    const next = appointments.map((a) => (a.id === id ? { ...a, estado } : a));
    setAppointments(next);
    saveAppointments(next);
  }

  function remove(id) {
    if (!confirm("¿Eliminar esta cita?")) return;
    const next = appointments.filter((a) => a.id !== id);
    setAppointments(next);
    saveAppointments(next);
  }

  return (
    <div className="citas-page">
      <div className="citas-header">
        <div>
          <h1>Citas</h1>
          <p className="muted">Vista por día, semana o mes. (Fase 2.1)</p>
        </div>

        <div className="citas-actions">
          <div className="tabs">
            <button className={tab === "dia" ? "active" : ""} onClick={() => setTab("dia")}>
              Día
            </button>
            <button className={tab === "semana" ? "active" : ""} onClick={() => setTab("semana")}>
              Semana
            </button>
            <button className={tab === "mes" ? "active" : ""} onClick={() => setTab("mes")}>
              Mes
            </button>
          </div>

          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="date"
          />

          <button className="btn-primary" onClick={openNew}>
            + Nueva cita
          </button>
        </div>
      </div>

      <div className="citas-card">
        <div className="citas-summary">
          <div>
            <div className="label">Rango</div>
            <div className="value">
              {range.from.toLocaleDateString()} — {range.to.toLocaleDateString()}
            </div>
          </div>
          <div>
            <div className="label">Total</div>
            <div className="value">{filtered.length}</div>
          </div>
        </div>

        <div className="table">
          <div className="tr th">
            <div>Fecha</div>
            <div>Hora</div>
            <div>Paciente</div>
            <div>Doctor/a</div>
            <div>Motivo</div>
            <div>Estado</div>
            <div className="right">Acciones</div>
          </div>

          {filtered.length === 0 ? (
            <div className="empty">No hay citas en este rango.</div>
          ) : (
            filtered.map((a) => {
              const d = new Date(a.startAt);
              return (
                <div className="tr" key={a.id}>
                  <div>{d.toLocaleDateString()}</div>
                  <div>{d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>
                  <div className="strong">{a.paciente}</div>
                  <div>{a.doctor}</div>
                  <div className="muted">{a.motivo || "—"}</div>
                  <div>
                    <select
                      value={a.estado}
                      onChange={(e) => setEstado(a.id, e.target.value)}
                      className="estado"
                    >
                      <option>Programada</option>
                      <option>Confirmada</option>
                      <option>En espera</option>
                      <option>Completada</option>
                      <option>Cancelada</option>
                      <option>No asistió</option>
                    </select>
                  </div>
                  <div className="right actions">
                    <button className="btn-ghost" onClick={() => remove(a.id)}>
                      Eliminar
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {open && (
        <div className="modal-backdrop" onMouseDown={() => setOpen(false)}>
          <div className="modal" onMouseDown={(e) => e.stopPropagation()}>
            <div className="modal-title">
              <h2>Nueva cita</h2>
              <button className="x" onClick={() => setOpen(false)}>
                ×
              </button>
            </div>

            <form onSubmit={createAppointment} className="form">
              <div className="grid">
                <div className="field">
                  <label>Paciente *</label>
                  <input
                    value={form.paciente}
                    onChange={(e) => setForm({ ...form, paciente: e.target.value })}
                    placeholder="Ej: Carlos Samboy"
                  />
                </div>

                <div className="field">
                  <label>Doctor/a *</label>
                  <input
                    value={form.doctor}
                    onChange={(e) => setForm({ ...form, doctor: e.target.value })}
                    placeholder="Ej: Dra. Pérez"
                  />
                </div>

                <div className="field">
                  <label>Fecha *</label>
                  <input
                    type="date"
                    value={form.fecha}
                    onChange={(e) => setForm({ ...form, fecha: e.target.value })}
                  />
                </div>

                <div className="field">
                  <label>Hora *</label>
                  <input
                    type="time"
                    value={form.hora}
                    onChange={(e) => setForm({ ...form, hora: e.target.value })}
                  />
                </div>

                <div className="field">
                  <label>Duración</label>
                  <select
                    value={form.duracionMin}
                    onChange={(e) => setForm({ ...form, duracionMin: Number(e.target.value) })}
                  >
                    <option value={15}>15 min</option>
                    <option value={30}>30 min</option>
                    <option value={45}>45 min</option>
                    <option value={60}>60 min</option>
                    <option value={90}>90 min</option>
                  </select>
                </div>

                <div className="field">
                  <label>Estado</label>
                  <select
                    value={form.estado}
                    onChange={(e) => setForm({ ...form, estado: e.target.value })}
                  >
                    <option>Programada</option>
                    <option>Confirmada</option>
                    <option>En espera</option>
                    <option>Completada</option>
                    <option>Cancelada</option>
                    <option>No asistió</option>
                  </select>
                </div>

                <div className="field span2">
                  <label>Motivo</label>
                  <input
                    value={form.motivo}
                    onChange={(e) => setForm({ ...form, motivo: e.target.value })}
                    placeholder="Ej: Limpieza, dolor, control…"
                  />
                </div>

                <div className="field span2">
                  <label>Nota</label>
                  <textarea
                    rows={3}
                    value={form.nota}
                    onChange={(e) => setForm({ ...form, nota: e.target.value })}
                    placeholder="Opcional"
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-ghost" onClick={() => setOpen(false)}>
                  Cancelar
                </button>
                <button className="btn-primary" type="submit">
                  Guardar cita
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
