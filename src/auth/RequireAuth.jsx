// src/auth/RequireAuth.jsx
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { getSuperAdminStatus, getMyClinics } from "../lib/authSupabase";

export default function RequireAuth({ children }) {
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function run() {
      setLoading(true);

      const { data } = await supabase.auth.getSession();
      const session = data?.session;
      if (!session?.user) {
        if (mounted) {
          setAllowed(false);
          setLoading(false);
        }
        return;
      }

      // 1) SUPER_ADMIN entra directo
      const { isSuperAdmin } = await getSuperAdminStatus();
      if (isSuperAdmin) {
        if (mounted) {
          setAllowed(true);
          setLoading(false);
        }
        return;
      }

      // 2) si no es super admin, debe pertenecer a alguna clínica
      try {
        const memberships = await getMyClinics();
        const ok = memberships.length > 0;
        if (mounted) {
          setAllowed(ok);
          setLoading(false);
        }
      } catch (e) {
        if (mounted) {
          setAllowed(false);
          setLoading(false);
        }
      }
    }

    run();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return null;

  if (!allowed) return <Navigate to="/login" replace />;

  return children;
}
