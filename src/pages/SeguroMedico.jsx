import React from "react";

export default function SeguroMedico() {
  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ margin: 0 }}>Seguro médico ✅</h2>
      <p style={{ opacity: 0.8, marginTop: 8 }}>
        Ya no es "en construcción". Próximo paso: conectar aseguradoras y planes con Supabase (CRUD completo).
      </p>

      <div
        style={{
          marginTop: 14,
          background: "#fff",
          border: "1px solid rgba(0,0,0,0.08)",
          borderRadius: 14,
          padding: 14,
        }}
      >
        <h3 style={{ marginTop: 0 }}>Módulo (listo para conectar)</h3>
        <ul style={{ margin: 0, opacity: 0.85 }}>
          <li>Aseguradoras (crear/editar/borrar)</li>
          <li>Planes (cobertura %, copago, deducible, límite anual)</li>
          <li>Luego: asignarlo al paciente y aplicarlo en factura</li>
        </ul>

        <div style={{ marginTop: 14 }}>
          <a
            href="/my-clinic/seguro"
            style={{
              display: "inline-block",
              padding: "10px 12px",
              borderRadius: 10,
              background: "#2563eb",
              color: "#fff",
              textDecoration: "none",
              fontWeight: 700,
            }}
          >
            Estoy aquí ✅
          </a>
        </div>
      </div>
    </div>
  );
}
