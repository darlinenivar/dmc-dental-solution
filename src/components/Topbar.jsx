// src/components/Topbar.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function Topbar({ title = "Dashboard", onOpenMobileSidebar }) {
  const nav = useNavigate();
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    let alive = true;
    supabase.auth.getUser().then(({ data }) => {
      if (!alive) return;
      setUserEmail(data?.user?.email || "");
    });
    return () => {
      alive = false;
    };
  }, []);

  const shortEmail = useMemo(() => {
    if (!userEmail) return "Cuenta";
    return userEmail.length > 22 ? `${userEmail.slice(0, 22)}…` : userEmail;
  }, [userEmail]);

  const logout = async () => {
    await supabase.auth.signOut();
    nav("/login", { replace: true });
  };

  return (
    <header className="tb">
      <button className="tb__burger" type="button" onClick={onOpenMobileSidebar}>
        ☰
      </button>

      <div className="tb__title">{title}</div>

      <div className="tb__right">
        <div className="tb__pill">{shortEmail}</div>
        <button className="tb__btn" type="button" onClick={logout}>
          Cerrar sesión
        </button>
      </div>
    </header>
  );
}
