import React from "react";
import "../styles/dashboard.css";

export default function DashboardHome() {
  return (
    <div className="card">
      <h2>Bienvenida 👋</h2>
      <p>Tu clínica ya está lista. Desde aquí podrás gestionar pacientes, doctores, citas y facturación.</p>

      <div className="grid">
        <div className="mini">🧑‍⚕️ Pacientes</div>
        <div className="mini">🩺 Doctores</div>
        <div className="mini">📅 Citas</div>
        <div className="mini">🧾 Facturación</div>
      </div>
    </div>
  );
}
