import React from "react";
import { useRouteError, isRouteErrorResponse, Link } from "react-router-dom";

export default function ErrorBoundary() {
  const err = useRouteError();

  let title = "Ocurrió un error";
  let message = "Revisa la consola para más detalles.";

  if (isRouteErrorResponse(err)) {
    title = `Error ${err.status}`;
    message = err.statusText || message;
  } else if (err instanceof Error) {
    message = err.message;
  } else if (typeof err === "string") {
    message = err;
  }

  return (
    <div style={{ padding: 24, fontFamily: "system-ui" }}>
      <h2 style={{ margin: 0 }}>{title}</h2>
      <p style={{ whiteSpace: "pre-wrap" }}>{message}</p>

      <div style={{ display: "flex", gap: 12 }}>
        <button
          onClick={() => window.location.reload()}
          style={{
            padding: "10px 14px",
            borderRadius: 10,
            border: "1px solid #ccc",
            cursor: "pointer",
          }}
        >
          Recargar
        </button>

        <Link to="/" style={{ padding: "10px 14px" }}>
          Ir al Dashboard
        </Link>

        <Link to="/login" style={{ padding: "10px 14px" }}>
          Ir a Login
        </Link>
      </div>
    </div>
  );
}
