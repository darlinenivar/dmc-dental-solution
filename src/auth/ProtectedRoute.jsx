// src/auth/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";

export default function ProtectedRoute({ children }) {
  const { booting, user } = useAuth();

  if (booting) {
    return (
      <div style={{ padding: 24, fontFamily: "system-ui" }}>
        Cargando...
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  return children;
}
