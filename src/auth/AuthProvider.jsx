import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "../supabaseClient";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  async function loadProfile(user) {
    if (!user) {
      setProfile(null);
      return;
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("id,email,first_name,last_name,phone,role,clinic_id")
      .eq("id", user.id)
      .maybeSingle();

    if (error) {
      console.warn("loadProfile error:", error.message);
      setProfile(null);
      return;
    }
    setProfile(data ?? null);
  }

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(async ({ data }) => {
      if (!mounted) return;
      setSession(data.session ?? null);
      await loadProfile(data.session?.user ?? null);
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      setSession(newSession ?? null);
      await loadProfile(newSession?.user ?? null);
      setLoading(false);
    });

    return () => {
      mounted = false;
      sub?.subscription?.unsubscribe?.();
    };
  }, []);

  const value = useMemo(
    () => ({
      session,
      user: session?.user ?? null,
      profile,
      loading,
      isSuperAdmin: profile?.role === "super_admin",
      signOut: () => supabase.auth.signOut(),
      refreshProfile: async () => loadProfile(session?.user ?? null),
    }),
    [session, profile, loading]
  );

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  return useContext(AuthCtx);
}
