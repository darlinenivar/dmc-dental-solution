import React, { useMemo, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";
import "./dashboard.css";

const titleFromPath = (pathname) => {
  if (pathname.startsWith("/dashboard")) return "Dashboard";
  if (pathname.startsWith("/patients")) return "Pacientes";
  if (pathname.startsWith("/appointments")) return "Citas";
  if (pathname.startsWith("/odontogram")) return "Odontograma";
  if (pathname.startsWith("/billing")) return "Facturación";
  if (pathname.startsWith("/settings")) return "Configuración";
  if (pathname.startsWith("/admin")) return "Super Admin";
  return "DMC Dental Solution";
};

export default function DashboardLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const pageTitle = useMemo(() => titleFromPath(location.pathname), [location.pathname]);

  return (
    <div className="appShell">
      {/* Mobile overlay */}
      <div
        className={`mobileOverlay ${mobileOpen ? "show" : ""}`}
        onClick={() => setMobileOpen(false)}
      />

      <aside className={`sidebarWrap ${sidebarCollapsed ? "collapsed" : ""} ${mobileOpen ? "mobileOpen" : ""}`}>
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed((v) => !v)}
          onCloseMobile={() => setMobileOpen(false)}
        />
      </aside>

      <main className={`mainWrap ${sidebarCollapsed ? "expanded" : ""}`}>
        <Topbar
          title={pageTitle}
          onOpenMobileSidebar={() => setMobileOpen(true)}
          collapsed={sidebarCollapsed}
        />

        <div className="contentWrap">
          <Outlet />
        </div>

        <footer className="footer">
          <span>© {new Date().getFullYear()} DMC Dental Solution</span>
        </footer>
      </main>
    </div>
  );
}
