import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";

export default function Topbar({ title, onOpenMobileSidebar }) {
  const nav = useNavigate();
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    let active = true;
    supabase.auth.getUser().then(({ data }) => {
      if (!active) return;
      setUserEmail(data?.user?.email || "");
    });
    return () => { active = false; };
  }, []);

  const shortEmail = useMemo(() => {
    if (!userEmail) return "Cuenta";
    return userEmail.length > 22 ? userEmail.slice(0, 22) + "…" : userEmail;
  }, [userEmail]);

  const logout = async () => {
    await supabase.auth.signOut();
    nav("/login", { replace: true });
  };

  return (
    <header className="topbar">
      <div className="topbarLeft">
        <button className="iconBtn mobileOnly" onClick={onOpenMobileSidebar} title="Menú">
          ☰
        </button>
        <div className="topbarTitle">
          <div className="title">{title}</div>
          <div className="subtitle">Acceso seguro • Multi-clínicas • Control por roles</div>
        </div>
      </div>

      <div className="topbarRight">
        <div className="pill">
          <span className="pillDot" />
          <span>{shortEmail}</span>
        </div>

        <button className="btnPrimary" onClick={logout}>
          Cerrar sesión
        </button>
      </div>
    </header>
  );
}
