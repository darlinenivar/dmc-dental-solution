// src/layout/DashboardLayout.jsx
import React, { useMemo, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

const titleFromPath = (pathname) => {
  if (pathname.startsWith("/pacientes")) return "Pacientes";
  if (pathname.startsWith("/citas")) return "Citas";
  if (pathname.startsWith("/facturacion")) return "Facturación";
  if (pathname.startsWith("/settings")) return "Configuración";
  return "Dashboard";
};

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();

  const title = useMemo(() => titleFromPath(pathname), [pathname]);

  return (
    <div className="appShell">
      <div className={`mobileOverlay ${mobileOpen ? "is-open" : ""}`} onClick={() => setMobileOpen(false)} />

      <div className={`sidebarWrap ${mobileOpen ? "is-open" : ""}`}>
        <Sidebar
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed((v) => !v)}
          onCloseMobile={() => setMobileOpen(false)}
        />
      </div>

      <div className="mainWrap">
        <Topbar title={title} onOpenMobileSidebar={() => setMobileOpen(true)} />
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
