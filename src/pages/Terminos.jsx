import React from "react";
import { Link } from "react-router-dom";

export default function Terminos() {
  return (
    <div style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
      <h1>Términos y Condiciones</h1>
      <p>
        Estos términos regulan el uso de <b>DMC Dental Solution</b>.
      </p>

      <h2>Uso permitido</h2>
      <ul>
        <li>Solo usuarios autorizados por la clínica.</li>
        <li>No compartir credenciales.</li>
      </ul>

      <h2>Responsabilidad</h2>
      <p>
        El usuario es responsable de la exactitud de la información que ingresa.
      </p>

      <p style={{ marginTop: 18 }}>
        <Link to="/dashboard">Volver al dashboard</Link>
      </p>
    </div>
  );
}
