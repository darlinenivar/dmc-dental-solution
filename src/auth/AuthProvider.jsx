// src/auth/AuthProvider.jsx
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";
import { authApi } from "./auth";

const AuthContext = createContext(null);

const parseSuperAdmins = () => {
  const raw = import.meta.env.VITE_SUPER_ADMIN_EMAILS || "";
  return raw
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
};

async function ensureProfileAndMembership(user, pending) {
  // 1) upsert profile
  const superAdmins = parseSuperAdmins();
  const isSuperAdmin = superAdmins.includes((user?.email || "").toLowerCase());

  const profilePayload = {
    id: user.id,
    first_name: pending?.first_name || "",
    last_name: pending?.last_name || "",
    phone: pending?.phone || "",
    role: isSuperAdmin ? "super_admin" : "staff",
  };

  await supabase.from("profiles").upsert(profilePayload, { onConflict: "id" });

  // 2) si hay clínica pendiente, créala y crea membership si aún no existe
  if (pending?.clinic_name && pending?.country) {
    const { data: existing } = await supabase
      .from("memberships")
      .select("id, clinic_id")
      .eq("user_id", user.id)
      .limit(1);

    if (!existing || existing.length === 0) {
      const { data: clinic, error: clinicErr } = await supabase
        .from("clinics")
        .insert({
          name: pending.clinic_name,
          country: pending.country,
          created_by: user.id,
        })
        .select("*")
        .single();

      if (clinicErr) throw clinicErr;

      const role = isSuperAdmin ? "clinic_admin" : "clinic_admin";

      const { error: memErr } = await supabase.from("memberships").insert({
        user_id: user.id,
        clinic_id: clinic.id,
        role,
      });

      if (memErr) throw memErr;
    }
  }
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    let sub;

    (async () => {
      const { data } = await authApi.getSession();
      setSession(data.session || null);
      setUser(data.session?.user || null);

      // Si quedó info pendiente del registro, intenta crear perfil/clinica/membership
      if (data.session?.user) {
        const raw = localStorage.getItem("pending_signup");
        if (raw) {
          try {
            const pending = JSON.parse(raw);
            await ensureProfileAndMembership(data.session.user, pending);
            localStorage.removeItem("pending_signup");
          } catch (e) {
            // si falla, no rompemos la app
            console.warn("pending_signup error:", e);
          }
        }
      }

      setBooting(false);

      const { data: listener } = authApi.onAuthStateChange(async (_event, newSession) => {
        setSession(newSession || null);
        setUser(newSession?.user || null);

        if (newSession?.user) {
          const raw = localStorage.getItem("pending_signup");
          if (raw) {
            try {
              const pending = JSON.parse(raw);
              await ensureProfileAndMembership(newSession.user, pending);
              localStorage.removeItem("pending_signup");
            } catch (e) {
              console.warn("pending_signup error:", e);
            }
          }
        }
      });

      sub = listener?.subscription;
    })();

    return () => {
      if (sub) sub.unsubscribe();
    };
  }, []);

  const value = useMemo(
    () => ({
      booting,
      session,
      user,
      signIn: authApi.signIn,
      signUp: authApi.signUp,
      resetPassword: authApi.resetPassword,
      updatePassword: authApi.updatePassword,
      signOut: authApi.signOut,
    }),
    [booting, session, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
