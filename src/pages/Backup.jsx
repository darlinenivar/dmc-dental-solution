import React, { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Backup() {
  const [downloading, setDownloading] = useState(false);

  const downloadJSON = async () => {
    setDownloading(true);
    try {
      const { data: clinic } = await supabase.from("clinics").select("*").limit(1).single();
      if (!clinic) {
        alert("No hay clínica creada");
        return;
      }

      const tables = [
        "clinics",
        "patients",
        "doctors",
        "appointments",
        "procedures",
        "invoices",
        "invoice_items",
        "payments",
        "transactions",
      ];

      const backup = { meta: { createdAt: new Date().toISOString(), clinicId: clinic.id } };

      for (const t of tables) {
        const { data, error } = await supabase.from(t).select("*");
        backup[t] = error ? { error: error.message } : (data || []);
      }

      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `dmc-backup-${clinic.id}-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();

      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      alert("Error creando backup");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>☁️ Backup</h2>
      <p>Descarga toda la data del sistema en formato JSON.</p>

      <button onClick={downloadJSON} disabled={downloading}>
        {downloading ? "Generando..." : "Descargar JSON"}
      </button>
    </div>
  );
}
