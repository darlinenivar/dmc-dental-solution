import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabaseClient";

const ClinicContext = createContext(null);

export function ClinicProvider({ children }) {
  const [clinic, setClinic] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchClinic = async () => {
    setLoading(true);

    const { data: authData } = await supabase.auth.getUser();
    const user = authData?.user;

    if (!user) {
      setClinic(null);
      setLoading(false);
      return;
    }

    // Trae clinic via user_profiles join clinics
    const { data, error } = await supabase
      .from("user_profiles")
      .select("clinic_id, clinics:clinic_id ( id, name, logo_url )")
      .eq("user_id", user.id)
      .maybeSingle();

    if (error) {
      console.error("fetchClinic error:", error);
      setClinic(null);
      setLoading(false);
      return;
    }

    setClinic(data?.clinics || null);
    setLoading(false);
  };

  useEffect(() => {
    fetchClinic();

    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      fetchClinic();
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const value = useMemo(
    () => ({
      clinic,
      loading,
      refreshClinic: fetchClinic,
      setClinic,
    }),
    [clinic, loading]
  );

  return <ClinicContext.Provider value={value}>{children}</ClinicContext.Provider>;
}

export function useClinic() {
  const ctx = useContext(ClinicContext);
  if (!ctx) throw new Error("useClinic must be used inside ClinicProvider");
  return ctx;
}
