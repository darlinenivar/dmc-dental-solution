// src/components/BirthdaysPanel.jsx
import React, { useMemo } from "react";
import { lsGet } from "../lib/dashboardStorage";

function parseDob(p) {
  // soporta dob / birthDate / fecha_nacimiento
  const raw = p?.dob || p?.birthDate || p?.fecha_nacimiento;
  if (!raw) return null;
  const d = new Date(raw);
  return isNaN(d.getTime()) ? null : d;
}

function daysUntilBirthday(dob) {
  const now = new Date();
  const thisYear = new Date(now.getFullYear(), dob.getMonth(), dob.getDate());
  const next = thisYear >= new Date(now.getFullYear(), now.getMonth(), now.getDate())
    ? thisYear
    : new Date(now.getFullYear() + 1, dob.getMonth(), dob.getDate());

  const diff = next - now;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export default function BirthdaysPanel() {
  const patients = lsGet("patients", []); // <- si tu app usa otra key, dime y la cambio

  const upcoming = useMemo(() => {
    const arr = (Array.isArray(patients) ? patients : [])
      .map((p) => {
        const dob = parseDob(p);
        if (!dob) return null;
        const days = daysUntilBirthday(dob);
        const name = p?.name || p?.nombre || "Paciente";
        return { id: p?.id || name + String(dob), name, days, dob };
      })
      .filter(Boolean)
      .sort((a, b) => a.days - b.days)
      .slice(0, 6);

    return arr;
  }, [patients]);

  return (
    <div className="card">
      <div className="card-head">
        <div>
          <div className="card-title">Cumpleaños</div>
          <div className="card-sub">Próximos</div>
        </div>
      </div>

      {upcoming.length === 0 ? (
        <div className="muted">No hay fechas de nacimiento registradas.</div>
      ) : (
        <div className="list">
          {upcoming.map((p) => (
            <div key={p.id} className="list-row">
              <div className="list-main">
                <div className="list-title">{p.name}</div>
                <div className="list-sub">
                  {p.dob.toLocaleDateString("es-ES", { day: "2-digit", month: "long" })}
                </div>
              </div>
              <div className="pill">{p.days} d</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
