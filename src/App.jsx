import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { supabaseEnvOk, supabaseEnvDebug } from "./lib/supabase";

// ✅ IMPORTS DE TUS PÁGINAS (estas existen por tus screenshots)
// Si alguna ruta/archivo tuviera otro nombre, me dices y lo ajusto.
import Dashboard from "./pages/Dashboard";
import Doctores from "./pages/Doctores";
import Pacientes from "./pages/Pacientes";
import NotFound from "./pages/NotFound";

export default function App() {
  // ✅ Si faltan env vars en Netlify, NO dejamos que la app se rompa
  if (!supabaseEnvOk) {
    return (
      <div
        style={{
          minHeight: "100vh",
          padding: 24,
          fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial",
          background: "#0b1220",
          color: "#e8eefc",
        }}
      >
        <h2 style={{ margin: 0 }}>Configuración incompleta</h2>
        <p style={{ opacity: 0.9 }}>
          Faltan variables de entorno de Supabase en producción (Netlify).
        </p>

        <div
          style={{
            marginTop: 12,
            padding: 14,
            borderRadius: 12,
            background: "#0f1b33",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div style={{ fontWeight: 700, marginBottom: 8 }}>Debug</div>
          <pre
            style={{
              margin: 0,
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              fontSize: 13,
              lineHeight: 1.4,
              color: "#b7ffb0",
            }}
          >
            {JSON.stringify(supabaseEnvDebug, null, 2)}
          </pre>
        </div>

        <div style={{ marginTop: 14, opacity: 0.95 }}>
          <p style={{ marginBottom: 6 }}>
            En Netlify agrega estas variables EXACTAS:
          </p>
          <ul style={{ marginTop: 6 }}>
            <li>
              <b>VITE_SUPABASE_URL</b>
            </li>
            <li>
              <b>VITE_SUPABASE_ANON_KEY</b>
            </li>
          </ul>

          <p style={{ marginTop: 10 }}>
            Luego ve a: <b>Deploys → Trigger deploy → Clear cache and deploy</b>
          </p>
        </div>
      </div>
    );
  }

  // ✅ App normal con rutas
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/doctores" element={<Doctores />} />
        <Route path="/pacientes" element={<Pacientes />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
