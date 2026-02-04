import { useEffect, useState } from "react";
import { supabase } from "../config/supabaseClient";

export default function Sidebar() {
  const [data, setData] = useState({
    clinic_name: "DMC Dental Solution",
    logo_url: "",
  });

  const load = async () => {
    const { data: auth } = await supabase.auth.getUser();
    const user = auth?.user;
    if (!user) return;

    const { data: row, error } = await supabase
      .from("clinic_settings")
      .select("clinic_name, logo_url")
      .eq("owner_id", user.id)
      .maybeSingle();

    if (error) {
      console.error("Sidebar load error:", error);
      return;
    }

    if (row) {
      setData({
        clinic_name: row.clinic_name || "DMC Dental Solution",
        logo_url: row.logo_url || "",
      });
    }
  };

  useEffect(() => {
    load();
    const handler = () => load();
    window.addEventListener("clinic-updated", handler);
    return () => window.removeEventListener("clinic-updated", handler);
  }, []);

  return (
    <aside className="w-64 bg-white border-r h-screen p-4">
      <div className="flex items-center gap-3 mb-6">
        {data.logo_url ? (
          <img
            src={data.logo_url}
            alt="Logo"
            className="w-10 h-10 object-contain"
          />
        ) : (
          <div className="w-10 h-10 rounded bg-gray-200" />
        )}

        <div className="leading-tight">
          <div className="font-semibold text-gray-900">{data.clinic_name}</div>
          <div className="text-xs text-gray-500">Dashboard</div>
        </div>
      </div>

      <nav className="space-y-2">
        <a className="block px-3 py-2 rounded hover:bg-gray-100" href="/dashboard">
          Dashboard
        </a>
        <a
          className="block px-3 py-2 rounded hover:bg-gray-100"
          href="/configuracion"
        >
          Configuración
        </a>
        <a className="block px-3 py-2 rounded hover:bg-gray-100" href="/privacidad">
          Privacidad
        </a>
      </nav>
    </aside>
  );
}