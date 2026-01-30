import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function ProtectedRoute({ children, onlySuperAdmin = false }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data?.user ?? null);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div style={{ padding: 40 }}>Cargando...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 🔐 SUPER ADMIN SEGURO
  const SUPER_ADMINS =
    import.meta.env.VITE_SUPER_ADMIN_EMAILS?.split(",") ?? [];

  const isSuperAdmin =
    user?.email && SUPER_ADMINS.includes(user.email);

  if (onlySuperAdmin && !isSuperAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
