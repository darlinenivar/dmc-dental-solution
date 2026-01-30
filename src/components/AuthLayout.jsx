import React from "react";

/**
 * ✍️ CAMBIA AQUÍ LOS TEXTOS DEL PANEL IZQUIERDO
 * (lo que tú sombreaste en tu login).
 */
const COPY = {
  subtitle: "Acceso seguro • Multi-clínicas • Control por roles",

  badges: [
    { icon: "🔒", label: "Seguridad" },
    { icon: "🏥", label: "Multi-clínicas" },
    { icon: "", label: "" },
  ],

  // ✅ Estos son los 2 textos con check (los que tú marcaste)
  features: [
    "Inicio de sesión rápido, seguro y sin complicaciones.",
    "",
  ],

  // ✅ El tip de abajo. Si no lo quieres, déjalo en ""
  tip: "",

  // ✅ El texto pequeño de abajo (si lo usas en tu layout)
  footerNote:
    "DTB",
};

export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="authShell">
      {/* Panel Izquierdo */}
      <div className="authLeft">
        <div>
          <h2 className="authTitle">{title}</h2>
          <p className="authSubtitle">{subtitle || COPY.subtitle}</p>

          <div
            style={{
              marginTop: 18,
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
            }}
          >
            {COPY.badges.map((b) => (
              <span key={b.label} className="badge">
                <span style={{ marginRight: 6 }}>{b.icon}</span>
                {b.label}
              </span>
            ))}
          </div>

          <div style={{ marginTop: 16 }}>
            {COPY.features.map((text) => (
              <div key={text} className="feature" style={{ marginTop: 12 }}>
                <div>✅</div>
                <div>{text}</div>
              </div>
            ))}
          </div>

          {!!COPY.tip && (
            <div className="footerNote" style={{ marginTop: 14 }}>
              {COPY.tip}
            </div>
          )}
        </div>

        {!!COPY.footerNote && (
          <div className="footerNote" style={{ marginTop: 14 }}>
            {COPY.footerNote}
          </div>
        )}
      </div>

      {/* Panel Derecho */}
      <div className="authRight">{children}</div>
    </div>
  );
}
