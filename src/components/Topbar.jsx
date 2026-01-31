import React from "react";
import { useAuth } from "../auth/AuthProvider";

export default function Topbar({ onMenu }) {
  const { user, signOut } = useAuth();

  return (
    <header className="topbar">
      <button className="icon-btn" onClick={onMenu} aria-label="Abrir menú">
        ☰
      </button>

      <div className="topbar-title">
        <div className="brand">DMC Dental Solution</div>
        <div className="subtitle">Dashboard</div>
      </div>

      <div className="topbar-right">
        <div className="user-pill" title={user?.email || ""}>
          {user?.email || "usuario"}
        </div>
        <button className="btn" onClick={signOut}>
          Cerrar sesión
        </button>
      </div>
    </header>
  );
}
