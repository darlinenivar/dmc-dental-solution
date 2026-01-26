import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div style={{ padding: 40, textAlign: "center" }}>
      <h1 style={{ margin: 0 }}>404</h1>
      <p style={{ opacity: 0.75 }}>Página no encontrada</p>
      <Link to="/my-clinic">Volver al dashboard</Link>
    </div>
  );
}
