import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSession } from "../lib/auth";
import { ensureOwnerBootstrap, loadMyContext, hasActiveClinic } from "../lib/dbSupabase";
import { setActiveClinicId } from "../lib/auth";

export default function AuthCallback() {
  const nav = useNavigate();
  const [msg, setMsg] = useState("Validando enlace…");

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        // Supabase procesa el token automáticamente al abrir el link.
        // Esperamos a que la sesión exista.
        let session = await getSession();

        // reintento corto por si tarda 1-2s
        if (!session) {
          await new Promise((r) => setTimeout(r, 800));
          session = await getSession();
        }

        if (!session) {
          setMsg("No se pudo iniciar sesión. Intenta reenviar el Magic Link.");
          return;
        }

        // Owner bootstrap (solo Darline si no tiene clínica)
        await ensureOwnerBootstrap();

        // cargar clínicas y decidir ruta
        const ctx = await loadMyContext();
        const clinics = ctx.clinics || [];

        if (hasActiveClinic(clinics)) {
          nav("/", { replace: true });
          return;
        }

        if (clinics.length === 1) {
          setActiveClinicId(clinics[0].id);
          nav("/", { replace: true });
          return;
        }

        // Si tiene varias, lo mandamos al login para que seleccione clínica
        // (tu Login ya tiene modo clinic picker)
        nav("/login", { replace: true });
      } catch (e) {
        console.error(e);
        if (!mounted) return;
        setMsg(e?.message || "Error en callback");
      }
    })();

    return () => {
      mounted = false;
    };
  }, [nav]);

  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 20 }}>
      <div style={{ maxWidth: 520, width: "100%", borderRadius: 16, padding: 18, border: "1px solid rgba(0,0,0,.1)" }}>
        <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 10 }}>🔐 Magic Link</div>
        <div style={{ opacity: 0.75 }}>{msg}</div>
      </div>
    </div>
  );
}
