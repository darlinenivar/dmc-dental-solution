import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

export default function DashboardLayout() {
  const navigate = useNavigate();

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <aside
        style={{
          width: 240,
          background: "#f3f4f6",
          padding: 16,
          borderRight: "1px solid #e5e7eb",
        }}
      >
        <h3 style={{ marginBottom: 20 }}>DMC Dental Solution</h3>

        <nav style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <NavLink to="/dashboard">🏠 Dashboard</NavLink>
          <NavLink to="/dashboard/pacientes">👥 Pacientes</NavLink>
          <NavLink to="/dashboard/citas">📅 Citas</NavLink>
          <NavLink to="/dashboard/doctores">🩺 Doctores</NavLink>
          <NavLink to="/dashboard/facturacion">💳 Facturación</NavLink>
          <NavLink to="/dashboard/configuracion">⚙️ Configuración</NavLink>
          <NavLink to="/politicas-privacidad">🔒 Privacidad</NavLink>

          <button
            onClick={() => navigate("/login")}
            style={{
              marginTop: 20,
              background: "#ef4444",
              color: "white",
              border: "none",
              padding: 8,
              borderRadius: 6,
              cursor: "pointer",
            }}
          >
            Cerrar sesión
          </button>
        </nav>
      </aside>

      {/* Contenido */}
      <main style={{ flex: 1, padding: 24 }}>
        <Outlet />
      </main>
    </div>
  );
}
