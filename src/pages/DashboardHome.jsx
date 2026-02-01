import React from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

function IconGear({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M19.4 15a8 8 0 0 0 .1-6l-2.1.3a6.8 6.8 0 0 0-1.2-1.2l.3-2.1a8 8 0 0 0-6-.1l.3 2.1c-.45.32-.84.72-1.2 1.2l-2.1-.3a8 8 0 0 0-.1 6l2.1-.3c.32.45.72.84 1.2 1.2l-.3 2.1a8 8 0 0 0 6 .1l-.3-2.1c.45-.32.84-.72 1.2-1.2l2.1.3Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconLogout({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M10 7V5a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-7a2 2 0 0 1-2-2v-2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M3 12h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M6 9l-3 3 3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function DashboardHome() {
  const navigate = useNavigate();

  const goConfig = () => navigate("/configuracion");

  const logout = async () => {
    await supabase.auth.signOut();
    navigate("/login", { replace: true });
  };

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700 }}>Bienvenida 👋</h1>
      <p style={{ marginTop: 8, color: "#6b7280" }}>
        Tu clínica ya está lista. Desde aquí podrás gestionar todo.
      </p>

      {/* Cards principales */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(180px, 1fr))",
          gap: 12,
          marginTop: 16,
        }}
      >
        <div style={cardStyle}><strong>Pacientes</strong><div style={subStyle}>Gestiona tus pacientes</div></div>
        <div style={cardStyle}><strong>Doctores</strong><div style={subStyle}>Equipo médico</div></div>
        <div style={cardStyle}><strong>Citas</strong><div style={subStyle}>Agenda y horarios</div></div>
        <div style={cardStyle}><strong>Facturación</strong><div style={subStyle}>Pagos y facturas</div></div>
      </div>

      {/* Acciones rápidas (NO topbar) */}
      <div
        style={{
          marginTop: 18,
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <div
          style={{
            border: "1px solid #e5e7eb",
            background: "#fff",
            borderRadius: 12,
            padding: 10,
            display: "flex",
            gap: 8,
            alignItems: "center",
            boxShadow: "0 1px 8px rgba(0,0,0,0.05)",
          }}
        >
          <button onClick={goConfig} style={miniBtnStyle} title="Configuración">
            <IconGear size={16} />
            <span style={{ fontSize: 13 }}>Configuración</span>
          </button>

          <button onClick={logout} style={{ ...miniBtnStyle, background: "#fff5f5", borderColor: "#fecaca" }} title="Cerrar sesión">
            <IconLogout size={16} />
            <span style={{ fontSize: 13 }}>Salir</span>
          </button>
        </div>
      </div>
    </div>
  );
}

const cardStyle = {
  border: "1px solid #e5e7eb",
  background: "#fff",
  borderRadius: 12,
  padding: 14,
  minHeight: 68,
};

const subStyle = { color: "#6b7280", marginTop: 6, fontSize: 13 };

const miniBtnStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  padding: "8px 10px",
  borderRadius: 10,
  border: "1px solid #e5e7eb",
  background: "#f9fafb",
  cursor: "pointer",
};
