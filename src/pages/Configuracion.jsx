// src/pages/Configuracion.jsx
import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import "../styles/configuracion.css";

export default function Configuracion() {
  const [tab, setTab] = useState("clinica"); // "clinica" | "cuenta"
  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState(null);

  // Clínica
  const [clinicId, setClinicId] = useState(null);
  const [clinicName, setClinicName] = useState("");
  const [clinicPhone, setClinicPhone] = useState("");
  const [clinicAddress, setClinicAddress] = useState("");

  // Guardar clínica
  const [savingClinic, setSavingClinic] = useState(false);
  const [clinicMsg, setClinicMsg] = useState({ type: "", text: "" });

  // Cuenta
  const [pw1, setPw1] = useState("");
  const [pw2, setPw2] = useState("");
  const [savingPw, setSavingPw] = useState(false);
  const [pwMsg, setPwMsg] = useState({ type: "", text: "" });

  const email = useMemo(() => user?.email || "", [user]);

  useEffect(() => {
    let mounted = true;

    async function boot() {
      setLoading(true);
      setClinicMsg({ type: "", text: "" });
      setPwMsg({ type: "", text: "" });

      // 1) sesión
      const { data: s1, error: e1 } = await supabase.auth.getSession();
      if (e1) {
        if (!mounted) return;
        setLoading(false);
        return;
      }

      const currentUser = s1?.session?.user || null;
      if (!mounted) return;
      setUser(currentUser);

      // Si no hay sesión, no rompemos nada: solo mostramos mensaje
      if (!currentUser) {
        setLoading(false);
        return;
      }

      // 2) traer clínica del owner
      const { data: clinic, error: cErr } = await supabase
        .from("clinics")
        .select("id, name, phone, address")
        .eq("owner_user_id", currentUser.id)
        .maybeSingle();

      // Si no existe, la creamos automática (autocreate)
      if (cErr) {
        // error real de consulta
        if (!mounted) return;
        setClinicMsg({ type: "error", text: `Error cargando clínica: ${cErr.message}` });
        setLoading(false);
        return;
      }

      if (!clinic) {
        const defaultName = "Mi Clínica";
        const { data: created, error: insErr } = await supabase
          .from("clinics")
          .insert([
            {
              owner_user_id: currentUser.id,
              name: defaultName,
              phone: "",
              address: "",
            },
          ])
          .select("id, name, phone, address")
          .single();

        if (insErr) {
          if (!mounted) return;
          setClinicMsg({
            type: "error",
            text: `No pude crear la clínica automáticamente: ${insErr.message}`,
          });
          setLoading(false);
          return;
        }

        if (!mounted) return;
        setClinicId(created.id);
        setClinicName(created.name || "");
        setClinicPhone(created.phone || "");
        setClinicAddress(created.address || "");
        setLoading(false);
        return;
      }

      // ya existe
      if (!mounted) return;
      setClinicId(clinic.id);
      setClinicName(clinic.name || "");
      setClinicPhone(clinic.phone || "");
      setClinicAddress(clinic.address || "");
      setLoading(false);
    }

    boot();

    // escuchar cambios de auth (login/logout)
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user || null;
      setUser(u);
      // si cambia sesión, recargamos
      setTimeout(() => boot(), 0);
    });

    return () => {
      mounted = false;
      sub?.subscription?.unsubscribe?.();
    };
  }, []);

  async function onSaveClinic(e) {
    e.preventDefault();
    setClinicMsg({ type: "", text: "" });

    if (!user) {
      setClinicMsg({ type: "error", text: "No hay sesión activa. Inicia sesión primero." });
      return;
    }
    if (!clinicId) {
      setClinicMsg({ type: "error", text: "No encuentro el clinicId. Refresca la página." });
      return;
    }
    if (!clinicName.trim()) {
      setClinicMsg({ type: "error", text: "El nombre de la clínica es obligatorio." });
      return;
    }

    setSavingClinic(true);
    try {
      const { error } = await supabase
        .from("clinics")
        .update({
          name: clinicName.trim(),
          phone: clinicPhone.trim(),
          address: clinicAddress.trim(),
        })
        .eq("id", clinicId);

      if (error) {
        setClinicMsg({ type: "error", text: error.message });
        return;
      }

      setClinicMsg({ type: "success", text: "✅ Clínica guardada correctamente." });
    } finally {
      setSavingClinic(false);
    }
  }

  async function onChangePassword(e) {
    e.preventDefault();
    setPwMsg({ type: "", text: "" });

    if (!user) {
      setPwMsg({ type: "error", text: "No hay sesión activa. Inicia sesión primero." });
      return;
    }
    if (pw1.length < 6) {
      setPwMsg({ type: "error", text: "La contraseña debe tener al menos 6 caracteres." });
      return;
    }
    if (pw1 !== pw2) {
      setPwMsg({ type: "error", text: "Las contraseñas no coinciden." });
      return;
    }

    setSavingPw(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: pw1 });
      if (error) {
        setPwMsg({ type: "error", text: error.message });
        return;
      }
      setPw1("");
      setPw2("");
      setPwMsg({ type: "success", text: "✅ Contraseña actualizada." });
    } finally {
      setSavingPw(false);
    }
  }

  async function onLogout() {
    await supabase.auth.signOut();
    // tu app ya debería redirigir por el guard/RequireAuth
  }

  return (
    <div className="cfg-page">
      <div className="cfg-header">
        <div>
          <h1 className="cfg-title">Configuración</h1>
          <p className="cfg-subtitle">Ajustes de clínica y cuenta</p>
        </div>

        <button className="cfg-btn cfg-btn-ghost" onClick={onLogout}>
          Cerrar sesión
        </button>
      </div>

      <div className="cfg-card">
        <div className="cfg-tabs">
          <button
            className={`cfg-tab ${tab === "clinica" ? "active" : ""}`}
            onClick={() => setTab("clinica")}
          >
            Clínica
          </button>
          <button
            className={`cfg-tab ${tab === "cuenta" ? "active" : ""}`}
            onClick={() => setTab("cuenta")}
          >
            Cuenta
          </button>
        </div>

        {loading ? (
          <div className="cfg-loading">
            <div className="cfg-spinner" />
            <span>Cargando…</span>
          </div>
        ) : !user ? (
          <div className="cfg-empty">
            <h3>No hay sesión activa</h3>
            <p>Inicia sesión para ver la configuración.</p>
          </div>
        ) : (
          <div className="cfg-body">
            {tab === "clinica" ? (
              <form onSubmit={onSaveClinic} className="cfg-form">
                <div className="cfg-grid">
                  <div className="cfg-field">
                    <label>Nombre de la clínica *</label>
                    <input
                      value={clinicName}
                      onChange={(e) => setClinicName(e.target.value)}
                      placeholder="Ej: DMC Dental Solution"
                    />
                  </div>

                  <div className="cfg-field">
                    <label>Teléfono</label>
                    <input
                      value={clinicPhone}
                      onChange={(e) => setClinicPhone(e.target.value)}
                      placeholder="Ej: (555) 000-0000"
                    />
                  </div>

                  <div className="cfg-field cfg-span-2">
                    <label>Dirección</label>
                    <input
                      value={clinicAddress}
                      onChange={(e) => setClinicAddress(e.target.value)}
                      placeholder="Ej: 123 Main St, New York, NY"
                    />
                  </div>
                </div>

                {clinicMsg.text ? (
                  <div className={`cfg-msg ${clinicMsg.type}`}>{clinicMsg.text}</div>
                ) : null}

                <div className="cfg-actions">
                  <button className="cfg-btn cfg-btn-primary" disabled={savingClinic}>
                    {savingClinic ? "Guardando…" : "Guardar cambios"}
                  </button>
                </div>
              </form>
            ) : (
              <div className="cfg-account">
                <div className="cfg-section">
                  <h3>Mi cuenta</h3>
                  <p className="cfg-muted">
                    Email (solo lectura) y cambio de contraseña.
                  </p>

                  <div className="cfg-field">
                    <label>Email</label>
                    <input value={email} readOnly className="cfg-readonly" />
                  </div>
                </div>

                <div className="cfg-divider" />

                <form onSubmit={onChangePassword} className="cfg-form">
                  <div className="cfg-section">
                    <h3>Cambiar contraseña</h3>

                    <div className="cfg-grid">
                      <div className="cfg-field">
                        <label>Nueva contraseña</label>
                        <input
                          type="password"
                          value={pw1}
                          onChange={(e) => setPw1(e.target.value)}
                          placeholder="Mínimo 6 caracteres"
                        />
                      </div>

                      <div className="cfg-field">
                        <label>Confirmar contraseña</label>
                        <input
                          type="password"
                          value={pw2}
                          onChange={(e) => setPw2(e.target.value)}
                          placeholder="Repite la contraseña"
                        />
                      </div>
                    </div>

                    {pwMsg.text ? (
                      <div className={`cfg-msg ${pwMsg.type}`}>{pwMsg.text}</div>
                    ) : null}

                    <div className="cfg-actions">
                      <button className="cfg-btn cfg-btn-primary" disabled={savingPw}>
                        {savingPw ? "Actualizando…" : "Guardar contraseña"}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="cfg-footnote">
        <span className="cfg-badge">DMC Dental Solution</span>
        <span className="cfg-muted">• Configuración básica (Clínica + Cuenta)</span>
      </div>
    </div>
  );
}
