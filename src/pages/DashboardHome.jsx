import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function DashboardHome() {
  const navigate = useNavigate();

  const go = (to) => () => navigate(to);

  return (
    <div>
      <div className="card">
        <div className="h1">Bienvenida 👋</div>
        <p className="p">Tu clínica ya está lista. Desde aquí podrás gestionar todo.</p>

        <div className="grid4">
          <Link className="tile" to="/dashboard/pacientes">
            <div className="tileTitle">Pacientes</div>
            <div className="tileSub">Gestiona tus pacientes</div>
          </Link>

          <Link className="tile" to="/dashboard/doctores">
            <div className="tileTitle">Doctores</div>
            <div className="tileSub">Equipo médico</div>
          </Link>

          <Link className="tile" to="/dashboard/citas">
            <div className="tileTitle">Citas</div>
            <div className="tileSub">Agenda y horarios</div>
          </Link>

          <Link className="tile" to="/dashboard/facturacion">
            <div className="tileTitle">Facturación</div>
            <div className="tileSub">Pagos y facturas</div>
          </Link>
        </div>

        {/* Botones pequeños (NO topbar) */}
        <div className="actionsRow">
          <button className="btn btnPrimary" onClick={go("/dashboard/configuracion")}>
            <span className="btnIcon">⚙️</span> Configuración
          </button>

          <button className="btn btnDanger" onClick={go("/login")}>
            <span className="btnIcon">🚪</span> Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
}
