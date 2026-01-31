export default function DashboardHome() {
  return (
    <div>
      <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>Dashboard</h1>
      <p style={{ marginTop: 8, color: "#64748b" }}>
        Bienvenido/a. Aquí verás resumen de pacientes, citas y actividad.
      </p>

      <div style={{ marginTop: 18, display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))" }}>
        <div className="card">
          <div className="card-title">Pacientes</div>
          <div className="card-num">—</div>
          <div className="card-sub">Total registrados</div>
        </div>
        <div className="card">
          <div className="card-title">Citas hoy</div>
          <div className="card-num">—</div>
          <div className="card-sub">Programadas</div>
        </div>
        <div className="card">
          <div className="card-title">Pendientes</div>
          <div className="card-num">—</div>
          <div className="card-sub">Acciones rápidas</div>
        </div>
      </div>
    </div>
  );
}
