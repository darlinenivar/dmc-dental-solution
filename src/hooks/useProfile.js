import { useEffect, useState } from "react";

// Intentamos cargar supabase si existe en tu proyecto.
// Si este import te da error, te digo debajo cómo cambiarlo.
import { supabase } from "../supabaseClient";

export function useProfile() {
  const [clinic, setClinic] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      try {
        // 1) Fallback rápido: si guardas la clínica en localStorage
        // (muchos proyectos guardan algo como clinic o clinicId).
        const rawClinic = localStorage.getItem("clinic");
        if (rawClinic) {
          const parsed = JSON.parse(rawClinic);
          if (!cancelled) setClinic(parsed);
          if (!cancelled) setLoading(false);
          return;
        }

        const clinicId = localStorage.getItem("clinicId");
        if (!clinicId) {
          if (!cancelled) setLoading(false);
          return;
        }

        // 2) Si tienes tabla "clinics" en Supabase:
        const { data, error } = await supabase
          .from("clinics")
          .select("*")
          .eq("id", clinicId)
          .single();

        if (error) throw error;

        if (!cancelled) setClinic(data);
      } catch (e) {
        console.error("useProfile error:", e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, []);

  return { clinic, loading };
}

export default useProfile;
