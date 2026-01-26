// src/pages/Dashboard.jsx
import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import MiniCalendar from "../components/MiniCalendar";
import NotesPanel from "../components/NotesPanel";
import BirthdaysPanel from "../components/BirthdaysPanel";

function StatCard({ title, value, sub, icon }) {
  return (
    <div className="stat">
      <div className="stat-left">
        <div className="stat-title">{title}</div>
        <div className="stat-value">{value}</div>
        <div className="stat-sub">{sub}</div>
      </div>
      <div className="stat-ico">{icon}</div>
    </div>
  );
}

function RecentActivity() {
  // Por ahora: placeholder bonito (luego lo conectamos a citas/facturas reales)
  return (
    <div className="card">
      <div className="card-head">
        <div>
          <div className="card-title">Actividad reciente</div>
          <div className="card-sub">Movimientos del sistema</div>
        </div>
        <button className="btn-link" type="button" disabled>
          Ver todo
        </button>
      </div>

      <div className="empty-state">
        <div className="dot-blue" />
        <div>
          <div className="empty-title">Aún no hay actividad</div>
          <div className="muted">
            Cuando crees pacientes, citas y facturas, aparecerán aquí.
          </div>
        </div>
      </div>
    </div>
  );
}

function SystemStatus() {
  return (
    <div className="card">
      <div className="card-head">
        <div>
          <div className="card-title">Estado del sistema</div>
          <div className="card-sub">Listo para producción (UI)</div>
        </div>
      </div>

      <div className="status">
        <span className="status-dot" />
        <div>
          <div className="status-title">Online</div>
          <div className="muted">Dashboard responsive (PC + móvil)</div>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();

  // Targets (si alguna ruta te da 404, me dices y lo ajusto a tu App.jsx)
  const ROUTES = useMemo(
    () => ({
      newPatient: "/my-clinic/patients",
      appointments: "/appointments",
      odontogram: "/my-clinic/odontograma",
      billing: "/my-clinic/finanzas",
      finance: "/my-clinic/finanzas",
      newInvoice: "/facturacion",
    }),
    []
  );

  return (
    <div className="dash">
      <div className="dash-top">
        <div>
          <div className="dash-title">Dashboard</div>
          <div className="dash-sub">Resumen general de tu clínica en tiempo real.</div>
        </div>

        <div className="dash-actions">
          <button className="btn-ghost" type="button" onClick={() => navigate(ROUTES.appointments)}>
            Ver calendario
          </button>
          <button className="btn-primary" type="button" onClick={() => navigate(ROUTES.appointments)}>
            + Nueva cita
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <StatCard title="Citas hoy" value="0" sub="Programadas para hoy" icon="📅" />
        <StatCard title="Próximas" value="0" sub="En agenda" icon="⏰" />
        <StatCard title="Siguientes 7 días" value="0" sub="Planificación semanal" icon="🗓️" />
        <StatCard title="Pacientes" value="0" sub="Total registrados" icon="👥" />
        <StatCard title="Re-call" value="0" sub="Pendientes de seguimiento" icon="🔥" />
      </div>

      <div className="dash-grid">
        {/* LEFT */}
        <div className="dash-left">
          <div className="card billing">
            <div className="card-head">
              <div>
                <div className="card-title">Facturación del mes</div>
                <div className="card-sub">Se reinicia cada mes</div>
              </div>
              <button className="btn-ghost" type="button" onClick={() => navigate(ROUTES.finance)}>
                Resumen
              </button>
            </div>

            <div className="billing-row">
              <div>
                <div className="billing-amount">RD$ 0</div>
                <div className="muted">
                  Próximo paso: conectar “Finanzas” + “Métodos de pago” para ver ingresos reales.
                </div>
              </div>

              <div className="billing-actions">
                <button className="btn-ghost" type="button" onClick={() => navigate(ROUTES.billing)}>
                  Ver finanzas
                </button>
                <button className="btn-primary" type="button" onClick={() => navigate(ROUTES.newInvoice)}>
                  Nueva factura
                </button>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-head">
              <div>
                <div className="card-title">Accesos rápidos</div>
                <div className="card-sub">Tareas comunes</div>
              </div>
            </div>

            <div className="quick-grid">
              <button className="quick" type="button" onClick={() => navigate(ROUTES.newPatient)}>
                <div className="quick-ico">➕</div>
                <div>
                  <div className="quick-title">Nuevo paciente</div>
                  <div className="muted">Crear y guardar datos</div>
                </div>
                <div className="quick-arrow">→</div>
              </button>

              <button className="quick" type="button" onClick={() => navigate(ROUTES.appointments)}>
                <div className="quick-ico">📆</div>
                <div>
                  <div className="quick-title">Crear cita</div>
                  <div className="muted">Agendar en calendario</div>
                </div>
                <div className="quick-arrow">→</div>
              </button>

              <button className="quick" type="button" onClick={() => navigate(ROUTES.newInvoice)}>
                <div className="quick-ico">🧾</div>
                <div>
                  <div className="quick-title">Nueva factura</div>
                  <div className="muted">Cobros y balance</div>
                </div>
                <div className="quick-arrow">→</div>
              </button>

              <button className="quick" type="button" onClick={() => navigate(ROUTES.odontogram)}>
                <div className="quick-ico">🦷</div>
                <div>
                  <div className="quick-title">Odontograma</div>
                  <div className="muted">Abrir por paciente</div>
                </div>
                <div className="quick-arrow">→</div>
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="dash-right">
          {/* Orden EXACTO como pediste: Calendario, Notas, Cumpleaños, Estado */}
          <RecentActivity />
          <MiniCalendar title="Calendario" />
          <NotesPanel />
          <BirthdaysPanel />
          <SystemStatus />
        </div>
      </div>
    </div>
  );
}
