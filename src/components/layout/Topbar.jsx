import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";

export default function Topbar({ onToggleSidebar }) {
  const nav = useNavigate();
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    let active = true;

    supabase.auth.getUser().then(({ data }) => {
      if (!active) return;
      setUserEmail(data?.user?.email || "");
    });

    return () => {
      active = false;
    };
  }, []);

  const shortEmail = useMemo(() => {
    if (!userEmail) return "Cuenta";
    return userEmail.length > 24 ? userEmail.slice(0, 24) + "…" : userEmail;
  }, [userEmail]);

  const logout = async () => {
    await supabase.auth.signOut();
    nav("/login", { replace: true });
  };

  return (
    <div className="top">
      <button className="top-btn" onClick={onToggleSidebar}>☰</button>

      <div className="top-right">
        <div className="chip">{shortEmail}</div>
        <button className="top-logout" onClick={logout}>Cerrar sesión</button>
      </div>
    </div>
  );
}
