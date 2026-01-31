import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div style={{ padding: 24 }}>
      <h2>Página no encontrada</h2>
      <Link to="/dashboard">Volver al dashboard</Link>
    </div>
  );
}
