export default function DashboardLayout({ children }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <aside style={{ width: 240, background: "#0f172a", color: "white", padding: 20 }}>
        <h3>DMC</h3>
        <nav>
          <p>Dashboard</p>
          <p>Pacientes</p>
          <p>Citas</p>
          <p>Facturación</p>
        </nav>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, padding: 24, background: "#f8fafc" }}>
        {children}
      </main>
    </div>
  );
}
