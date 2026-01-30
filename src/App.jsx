import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

export default function AppGuard({ children }) {
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

  return children;
}
