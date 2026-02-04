import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "../supabaseClient";
import "./configuracion.css";

const tabs = [
  { key: "clinica", label: "Clínica" },
  { key: "cuenta", label: "Cuenta" },
  { key: "seguridad", label: "Seguridad" },
];

export default function Configuracion() {
  const [tab, setTab] = useState("clinica");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [user, setUser] = useState(null);

  const [clinic, setClinic] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "US",
    theme_color: "#2563eb",
    logo_url: "",
  });

  const [error, setError] = useState("");
  const [ok, setOk] = useState("");

  // Password
  const [pw1, setPw1] = useState("");
  const [pw2, setPw2] = useState("");
  const canSavePw = useMemo(() => pw1.length >= 6 && pw1 === pw2, [pw1, pw2]);

  useEffect(() => {
    let mounted = true;

    (async () => {
      setError("");
      setOk("");
      setLoading(true);

      const { data: userRes, error: userErr } = await supabase.auth.getUser();
      if (!mounted) return;

      if (userErr) {
        setError(userErr.message);
        setLoading(false);
        return;
      }

      const u = userRes?.user || null;
      setUser(u);

      if (u?.id) {
        const { data: existing, error: fetchErr } = await supabase
          .from("clinics")
          .select("*")
          .eq("owner_user_id", u.id)
          .maybeSingle();

        if (!mounted) return;

        if (fetchErr) {
          setError(fetchErr.message);
          setLoading(false);
          return;
        }

        if (existing) {
          setClinic({
            name: existing.name || "",
            phone: existing.phone || "",
            address: existing.address || "",
            city: existing.city || "",
            state: existing.state || "",
            zip: existing.zip || "",
            country: existing.country || "US",
            theme_color: existing.theme_color || "#2563eb",
            logo_url: existing.logo_url || "",
          });
        } else {
          // Creamos por upsert, para que nunca falle por duplicados o race conditions
          const { error: upErr } = await supabase
            .from("clinics")
            .upsert(
              {
                owner_user_id: u.id,
                name: "Mi clínica",
                country: "US",
                theme_color: "#2563eb",
                logo_url: "",
              },
              { onConflict: "owner_user_id" }
            );

          if (upErr) {
            setError(upErr.message);
            setLoading(false);
            return;
          }

          const { data: created, error: readErr } = await supabase
            .from("clinics")
            .select("*")
            .eq("owner_user_id", u.id)
            .maybeSingle();

          if (readErr) {
            setError(readErr.message);
            setLoading(false);
            return;
          }

          if (created) {
            setClinic({
              name: created.name || "",
              phone: created.phone || "",
              address: created.address || "",
              city: created.city || "",
              state: created.state || "",
              zip: created.zip || "",
              country: created.country || "US",
              theme_color: created.theme_color || "#2563eb",
              logo_url: created.logo_url || "",
            });
          }
        }
      }

      setLoading(false);
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const onChangeClinic = (k, v) => setClinic((prev) => ({ ...prev, [k]: v }));

  const saveClinic = async () => {
    setError("");
    setOk("");
    setSaving(true);

    try {
      const { data: userRes, error: userErr } = await supabase.auth.getUser();
      if (userErr) throw userErr;
      const u = userRes?.user;
      if (!u?.id) throw new Error("No hay usuario autenticado.");

      // ✅ UP SERT (no falla si no existe la fila)
      const { error: upErr } = await supabase
        .from("clinics")
        .upsert(
          {
            owner_user_id: u.id,
            name: clinic.name,
            phone: clinic.phone,
            address: clinic.address,
            city: clinic.city,
            state: clinic.state,
            zip: clinic.zip,
            country: clinic.country,
            theme_color: clinic.theme_color,
            logo_url: clinic.logo_url || "",
          },
          { onConflict: "owner_user_id" }
        );

      if (upErr) throw upErr;

      setOk("✅ Cambios guardados.");
    } catch (e) {
      setError(e.message || "Error guardando clínica.");
    } finally {
      setSaving(false);
    }
  };

  const uploadLogo = async (file) => {
    setError("");
    setOk("");

    try {
      if (!file) return;

      const { data: userRes, error: userErr } = await supabase.auth.getUser();
      if (userErr) throw userErr;
      const u = userRes?.user;
      if (!u?.id) throw new Error("No hay usuario autenticado.");

      const ext = (file.name.split(".").pop() || "png").toLowerCase();
      const path = `${u.id}/logo.${ext}`;

      setSaving(true);

      // sube (upsert true reemplaza)
      const { error: upFileErr } = await supabase.storage
        .from("clinic-logos")
        .upload(path, file, { upsert: true });

      if (upFileErr) throw upFileErr;

      // obtener URL pública
      const { data: pub } = supabase.storage.from("clinic-logos").getPublicUrl(path);
      const url = pub?.publicUrl || "";

      if (!url) throw new Error("No se pudo obtener la URL del logo.");

      // guardar url en clinics
      const { error: upErr } = await supabase
        .from("clinics")
        .upsert(
          { owner_user_id: u.id, logo_url: url },
          { onConflict: "owner_user_id" }
        );

      if (upErr) throw upErr;

      setClinic((prev) => ({ ...prev, logo_url: url }));
      setOk("✅ Logo actualizado.");
    } catch (e) {
      setError(e.message || "Error subiendo logo.");
    } finally {
      setSaving(false);
    }
  };

  const savePassword = async () => {
    setError("");
    setOk("");
    setSaving(true);

    try {
      if (!canSavePw) throw new Error("La contraseña debe coincidir y tener 6+ caracteres.");

      const { error: pwErr } = await supabase.auth.updateUser({ password: pw1 });
      if (pwErr) throw pwErr;

      setPw1("");
      setPw2("");
      setOk("✅ Contraseña actualizada.");
    } catch (e) {
      setError(e.message || "Error cambiando contraseña.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="card" style={{ padding: 18 }}>Cargando configuración…</div>;

  return (
    <div className="configWrap">
      <div className="configHeader">
        <div>
          <h1 className="configTitle">Configuración</h1>
          <p className="configSub">Datos guardados en Supabase (protegidos por RLS).</p>
        </div>
      </div>

      <div className="tabs">
        {tabs.map((t) => (
          <button
            key={t.key}
            className={`tab ${tab === t.key ? "tab--active" : ""}`}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {error && <div className="alert alert--error">{error}</div>}
      {ok && <div className="alert alert--ok">{ok}</div>}

      <div className="grid">
        <div className="card">
          {tab === "clinica" && (
            <>
              <h2>Clínica</h2>

              {/* Logo */}
              <div style={{ display: "flex", gap: 14, alignItems: "center", marginTop: 10 }}>
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 16,
                    border: "1px solid rgba(0,0,0,.10)",
                    background: "#fff",
                    display: "grid",
                    placeItems: "center",
                    overflow: "hidden",
                  }}
                >
                  {clinic.logo_url ? (
                    <img src={clinic.logo_url} alt="Logo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <span style={{ fontSize: 26 }}>🏥</span>
                  )}
                </div>

                <div>
                  <div style={{ fontWeight: 800, marginBottom: 6 }}>Logo de la clínica</div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => uploadLogo(e.target.files?.[0])}
                    disabled={saving}
                  />
                  <div className="muted" style={{ marginTop: 6 }}>PNG/JPG. Se reemplaza automáticamente.</div>
                </div>
              </div>

              <div className="formGrid">
                <label>
                  Nombre de la clínica *
                  <input
                    value={clinic.name}
                    onChange={(e) => onChangeClinic("name", e.target.value)}
                    placeholder="DMC Dental Solution"
                  />
                </label>

                <label>
                  Teléfono
                  <input
                    value={clinic.phone}
                    onChange={(e) => onChangeClinic("phone", e.target.value)}
                    placeholder="(000) 000-0000"
                  />
                </label>

                <label className="span2">
                  Dirección
                  <input
                    value={clinic.address}
                    onChange={(e) => onChangeClinic("address", e.target.value)}
                    placeholder="Calle / Ave / etc."
                  />
                </label>

                <label>
                  Ciudad
                  <input value={clinic.city} onChange={(e) => onChangeClinic("city", e.target.value)} />
                </label>

                <label>
                  Estado
                  <input value={clinic.state} onChange={(e) => onChangeClinic("state", e.target.value)} />
                </label>

                <label>
                  Zip
                  <input value={clinic.zip} onChange={(e) => onChangeClinic("zip", e.target.value)} />
                </label>

                <label>
                  País
                  <input value={clinic.country} onChange={(e) => onChangeClinic("country", e.target.value)} placeholder="US" />
                </label>

                <label className="span2">
                  Color principal
                  <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <input
                      type="color"
                      value={clinic.theme_color}
                      onChange={(e) => onChangeClinic("theme_color", e.target.value)}
                      style={{ width: 54, height: 40, padding: 0, border: "none", background: "transparent" }}
                    />
                    <small>Se usa para el tema.</small>
                  </div>
                </label>
              </div>

              <div className="actions">
                <button className="btn" onClick={saveClinic} disabled={saving}>
                  {saving ? "Guardando…" : "Guardar cambios"}
                </button>
              </div>
            </>
          )}

          {tab === "cuenta" && (
            <>
              <h2>Cuenta</h2>
              <div className="kv">
                <div><b>Email:</b> {user?.email || "-"}</div>
                <div><b>User ID:</b> {user?.id || "-"}</div>
              </div>
            </>
          )}

          {tab === "seguridad" && (
            <>
              <h2>Seguridad</h2>
              <p className="muted">Cambia tu contraseña aquí mismo.</p>

              <div className="formGrid">
                <label className="span2">
                  Nueva contraseña
                  <input
                    type="password"
                    value={pw1}
                    onChange={(e) => setPw1(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                  />
                </label>

                <label className="span2">
                  Confirmar contraseña
                  <input
                    type="password"
                    value={pw2}
                    onChange={(e) => setPw2(e.target.value)}
                    placeholder="Repite la contraseña"
                  />
                </label>
              </div>

              <div className="actions">
                <button className="btn" onClick={savePassword} disabled={saving || !canSavePw}>
                  {saving ? "Guardando…" : "Guardar nueva contraseña"}
                </button>
              </div>
            </>
          )}
        </div>

        <div className="card card--side">
          <h3>Qué guarda esta sección</h3>
          <ul>
            <li>✅ Datos de la clínica</li>
            <li>✅ Color principal (tema)</li>
            <li>✅ Logo</li>
            <li>🔒 Protegido por RLS</li>
          </ul>

          <div style={{ marginTop: 14 }}>
            <h3>Listo</h3>
            <p className="muted">
              Configuración queda terminada: clínica + cuenta + contraseña + logo.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}