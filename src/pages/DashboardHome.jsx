import "../styles/dashboard.css";

export default function DashboardHome() {
  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <h1>Bienvenida 👋</h1>
        <p>
          Tu clínica ya está lista. Desde aquí podrás gestionar pacientes,
          doctores, citas y facturación.
        </p>

        <ul style={{ marginTop: "16px" }}>
          <li>📋 Pacientes</li>
          <li>🦷 Doctores</li>
          <li>📅 Citas</li>
          <li>💳 Facturación</li>
        </ul>
      </div>
    </div>
  );
}
