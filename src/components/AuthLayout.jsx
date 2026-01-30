import React from "react";

export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="container">
      <div className="card">
        <div className="grid">
          <div className="left">
            <div className="brand">
              <div className="logo">DMC</div>
              <div>
                <h1>DMC Dental Solution</h1>
                <p>Acceso seguro • Multi-clínicas • Control por roles</p>
              </div>
            </div>

            <div style={{ marginTop: 18, display: "flex", gap: 10, flexWrap: "wrap" }}>
              <span className="badge">🔐 Seguridad</span>
              <span className="badge">🏥 Multi-clínicas</span>
              <span className="badge">👩‍💼 Super Admin</span>
            </div>

            <div className="feature" style={{ marginTop: 16 }}>
              <div>✅</div>
              <div>
                Diseñado para consultorios reales: login rápido, recuperación de contraseña y creación de usuarios con clínica.
              </div>
            </div>

            <div className="feature">
              <div>✅</div>
              <div>
                Colores premium y legibles (sin tener que sombrear). Se adapta a laptop, tablet y móvil.
              </div>
            </div>

            <div className="footerNote">
              Tip: si estás configurando el “Olvidé mi contraseña”, en Supabase debes permitir el redirect a{" "}
              <b>/update-password</b>.
            </div>
          </div>

          <div className="right">
            <h2 className="title">{title}</h2>
            <p className="subtitle">{subtitle}</p>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
