import React, { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { supabase } from "../supabaseClient";
import "./dashboard.css";

export default function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");

  useEffect(() => {
    let mounted = true;

    (async () => {
      const { data } = await supabase.auth.getUser();
      if (!mounted) return;
      setEmail(data?.user?.email || "");
    })();

    return () => { mounted = false; };
  }, []);

  const onGoConfig = () => navigate("/dashboard/configuracion");

  const onLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const isConfig = location.pathname.startsWith("/dashboard/configuracion");

  return (
    <div className="dash">
      <Sidebar />

      <main className="dash__main">
        {/* Top bar fija */}
        <header className="dash__topbar">
          <div className="dash__topbarLeft">
            {/* opcional: puedes mostrar ruta/título */}
            <span className="dash__crumb">
              {isConfig ? "Configuración" : "Dashboard"}
            </span>
          </div>

          <div className="dash__topbarRight">
            <button
              className="iconBtn"
              title="Configuración"
              aria-label="Configuración"
              onClick={onGoConfig}
            >
              ⚙️
            </button>

            <button
              className="iconBtn iconBtn--danger"
              title="Cerrar sesión"
              aria-label="Cerrar sesión"
              onClick={onLogout}
            >
              ⎋
            </button>
          </div>
        </header>

        <section className="dash__content">
          <Outlet context={{ email }} />
        </section>
      </main>
    </div>
  );
}