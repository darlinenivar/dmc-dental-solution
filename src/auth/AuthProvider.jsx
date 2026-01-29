// src/auth/AuthProvider.jsx
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getSession, onAuthStateChange } from "../lib/authSupabase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const s = await getSession();
        if (mounted) setSession(s);
      } catch (e) {
        console.error("Auth getSession error:", e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    const { data } = onAuthStateChange((s) => {
      setSession(s);
      setLoading(false);
    });

    return () => {
      mounted = false;
      data?.subscription?.unsubscribe?.();
    };
  }, []);

  const value = useMemo(() => ({ session, user: session?.user ?? null, loading }), [session, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
