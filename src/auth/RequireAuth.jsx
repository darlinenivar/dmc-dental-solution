// src/auth/RequireAuth.jsx
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getUser, getMyClinics } from "../lib/authSupabase";

export default function RequireAuth({ children }) {
  const [checking, setChecking] = useState(true);
  const [isAuthed, setIsAuthed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      try {
        const user = await getUser();

        if (!user) {
          if (!cancelled) {
            setIsAuthed(false);
            setChecking(false);
          }
          return;
        }

        // Opcional: cargar clínicas y guardar 1 en localStorage (para tu DashboardHome)
        const clinics = await getMyClinics();
        if (clinics?.length) {
          localStorage.setItem("clinic", JSON.stringify(clinics[0]));
          localStorage.setItem("clinicId", clinics[0].id);
        }

        if (!cancelled) {
          setIsAuthed(true);
          setChecking(false);
        }
      } catch (e) {
        console.error("RequireAuth error:", e);
        if (!cancelled) {
          setIsAuthed(false);
          setChecking(false);
        }
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, []);

  if (checking) return null; // puedes poner loader si quieres

  if (!isAuthed) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
