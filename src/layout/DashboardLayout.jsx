import { NavLink, Outlet } from "react-router-dom";

export default function DashboardLayout() {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <aside style={{ width: 220, padding: 20, borderRight: "1px solid #eee" }}>
        <h3>DMC Dental Solution</h3>

        <nav style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink to="/dashboard/configuracion">Configuración</NavLink>
          <NavLink to="/dashboard/cambiar-password">Cambiar contraseña</NavLink>
          <NavLink to="/politicas-privacidad">Privacidad</NavLink>
        </nav>

        <button
          style={{
            marginTop: 20,
            background: "#dc2626",
            color: "#fff",
            border: "none",
            padding: "8px 10px",
            cursor: "pointer",
          }}
        >
          Cerrar sesión
        </button>
      </aside>

      <main style={{ flex: 1, padding: 24 }}>
        <Outlet />
      </main>
    </div>
  );
}
