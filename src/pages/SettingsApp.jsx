import React, { useEffect, useMemo, useState } from "react";
import "./../styles/settingsApp.css";
import { supabase } from "../lib/supabaseClient";

// Helpers
function maskSecret(value = "", visibleStart = 6, visibleEnd = 4) {
  if (!value) return "";
  if (value.length <= visibleStart + visibleEnd) return "•".repeat(value.length);
  const start = value.slice(0, visibleStart);
  const end = value.slice(-visibleEnd);
  return `${start}${"•".repeat(Math.max(6, value.length - (visibleStart + visibleEnd)))}${end}`;
}

async function copyToClipboard(text) {
  if (!text) return false;
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (e) {
    // fallback
    try {
      const el = document.createElement("textarea");
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      return true;
    } catch {
      return false;
    }
  }
}

export default function SettingsApp() {
  const env = useMemo(() => {
    const VITE_SITE_URL = import.meta.env.VITE_SITE_URL || "";
    const VITE_SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "";
    const VITE_SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "";
    return { VITE_SITE_URL, VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY };
  }, []);

  const [reveal, setReveal] = useState(false);
  const [copied, setCopied] = useState("");
  const [checking, setChecking] = useState(false);
  const [checkResult, setCheckResult] = useState({
    ok: false,
    message: "Aún no se ha verificado.",
    details: "",
  });

  // “Pro settings” (guardadas localmente)
  const [proSettings, setProSettings] = useState(() => {
    try {
      const raw = localStorage.getItem("dmc_pro_settings_v1");
      if (!raw) {
        return {
          appMode: "PRO",
          maintenance: false,
          allowSignup: true,
          requireEmailConfirm: true,
          enableBackups: true,
          enableAuditLog: true,
          brandName: "DMC Dental Solution",
          supportEmail: "support@dmcdentalsolution.com",
        };
      }
      return JSON.parse(raw);
    } catch {
      return {
        appMode: "PRO",
        maintenance: false,
        allowSignup: true,
        requireEmailConfirm: true,
        enableBackups: true,
        enableAuditLog: true,
        brandName: "DMC Dental Solution",
        supportEmail: "support@dmcdentalsolution.com",
      };
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("dmc_pro_settings_v1", JSON.stringify(proSettings));
    } catch {}
  }, [proSettings]);

  // Limpia el “copied” badge
  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(""), 1200);
    return () => clearTimeout(t);
  }, [copied]);

  const envStatus = useMemo(() => {
    const missing = [];
    if (!env.VITE_SITE_URL) missing.push("VITE_SITE_URL");
    if (!env.VITE_SUPABASE_URL) missing.push("VITE_SUPABASE_URL");
    if (!env.VITE_SUPABASE_ANON_KEY) missing.push("VITE_SUPABASE_ANON_KEY");
    return {
      ok: missing.length === 0,
      missing,
    };
  }, [env]);

  async function runSupabaseCheck() {
    setChecking(true);
    setCheckResult({ ok: false, message: "Verificando…", details: "" });

    try {
      // 1) Verificar que el cliente exista
      if (!supabase) {
        setCheckResult({
          ok: false,
          message: "Supabase client no está disponible.",
          details: "Revisa ../lib/supabaseClient",
        });
        setChecking(false);
        return;
      }

      // 2) Obtener sesión (si hay)
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

      // 3) Ping DB (query mínima)
      // Nota: Esto requiere que tengas al menos una tabla accesible públicamente o uses una vista.
      // Si no tienes tabla pública, este ping puede fallar por RLS, pero igual sirve para confirmar conectividad.
      let pingOk = false;
      let pingDetails = "";
      try {
        const { error: pingError } = await supabase.from("clinics").select("id").limit(1);
        if (pingError) {
          pingDetails = `DB ping (clinics) respondió con error: ${pingError.message}`;
        } else {
          pingOk = true;
          pingDetails = "DB ping (clinics) OK ✅";
        }
      } catch (e) {
        pingDetails = `DB ping falló: ${e?.message || String(e)}`;
      }

      const hasSession = !!sessionData?.session;
      const email = sessionData?.session?.user?.email || "";

      // Resultado final
      const ok = !!env.VITE_SUPABASE_URL && !!env.VITE_SUPABASE_ANON_KEY;

      setCheckResult({
        ok,
        message: ok
          ? "Conexión básica configurada ✅ (variables encontradas)."
          : "Faltan variables de entorno ❌",
        details: [
          sessionError ? `auth.getSession error: ${sessionError.message}` : `Sesión: ${hasSession ? `Activa (${email})` : "No activa"}`,
          pingDetails,
        ].join("\n"),
      });
    } catch (e) {
      setCheckResult({
        ok: false,
        message: "Falló la verificación.",
        details: e?.message || String(e),
      });
    } finally {
      setChecking(false);
    }
  }

  async function handleCopy(key, value) {
    const ok = await copyToClipboard(value);
    if (ok) setCopied(key);
  }

  return (
    <div className="appcfg-wrap">
      <div className="appcfg-header">
        <div>
          <h1 className="appcfg-title">App configuration</h1>
          <p className="appcfg-subtitle">
            Centro de configuración PRO: variables, conexión a Supabase, ajustes de seguridad y marca.
          </p>
        </div>

        <div className="appcfg-actions">
          <button className="btn-secondary" onClick={() => setReveal((v) => !v)}>
            {reveal ? "Ocultar secretos" : "Mostrar secretos"}
          </button>
          <button className="btn-primary" onClick={runSupabaseCheck} disabled={checking}>
            {checking ? "Verificando…" : "Probar Supabase"}
          </button>
        </div>
      </div>

      {/* STATUS */}
      <div className="grid-2">
        <div className="card">
          <div className="card-head">
            <div className="card-title">Estado de variables</div>
            <span className={`badge ${envStatus.ok ? "ok" : "warn"}`}>
              {envStatus.ok ? "OK" : "FALTAN"}
            </span>
          </div>

          <div className="card-body">
            {envStatus.ok ? (
              <div className="hint ok">Todo configurado. Vercel/Local deben tener estas variables.</div>
            ) : (
              <div className="hint warn">
                Falta: <b>{envStatus.missing.join(", ")}</b>
              </div>
            )}

            <div className="kv">
              <div className="kv-row">
                <div className="kv-k">VITE_SITE_URL</div>
                <div className="kv-v mono">{env.VITE_SITE_URL || "—"}</div>
                <button className="btn-mini" onClick={() => handleCopy("VITE_SITE_URL", env.VITE_SITE_URL)}>Copiar</button>
              </div>

              <div className="kv-row">
                <div className="kv-k">VITE_SUPABASE_URL</div>
                <div className="kv-v mono">{env.VITE_SUPABASE_URL || "—"}</div>
                <button className="btn-mini" onClick={() => handleCopy("VITE_SUPABASE_URL", env.VITE_SUPABASE_URL)}>Copiar</button>
              </div>

              <div className="kv-row">
                <div className="kv-k">VITE_SUPABASE_ANON_KEY</div>
                <div className="kv-v mono">
                  {env.VITE_SUPABASE_ANON_KEY
                    ? reveal
                      ? env.VITE_SUPABASE_ANON_KEY
                      : maskSecret(env.VITE_SUPABASE_ANON_KEY)
                    : "—"}
                </div>
                <button className="btn-mini" onClick={() => handleCopy("VITE_SUPABASE_ANON_KEY", env.VITE_SUPABASE_ANON_KEY)}>Copiar</button>
              </div>

              {copied ? <div className="copied">Copiado: {copied} ✅</div> : null}
            </div>

            <div className="divider" />

            <div className="small">
              Tip: si cambias variables en Vercel, haz <b>Redeploy</b> para que se apliquen.
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <div className="card-title">Diagnóstico Supabase</div>
            <span className={`badge ${checkResult.ok ? "ok" : "warn"}`}>
              {checkResult.ok ? "LISTO" : "REVISAR"}
            </span>
          </div>

          <div className="card-body">
            <div className={`hint ${checkResult.ok ? "ok" : "warn"}`}>{checkResult.message}</div>
            <pre className="pre">
{checkResult.details || "—"}
            </pre>

            <div className="divider" />

            <div className="small">
              Si el ping de DB falla por RLS, es normal. Lo importante es que variables estén y el auth funcione.
            </div>
          </div>
        </div>
      </div>

      {/* AJUSTES PRO */}
      <div className="card">
        <div className="card-head">
          <div className="card-title">Ajustes PRO</div>
          <span className="badge info">Se guardan en este navegador</span>
        </div>

        <div className="card-body">
          <div className="form-grid">
            <div className="form-field">
              <label>Modo de la app</label>
              <select
                value={proSettings.appMode}
                onChange={(e) => setProSettings((s) => ({ ...s, appMode: e.target.value }))}
              >
                <option value="PRO">PRO</option>
                <option value="BETA">BETA</option>
                <option value="DEV">DEV</option>
              </select>
              <div className="small">PRO = interfaz estable (recomendado para producción).</div>
            </div>

            <div className="form-field">
              <label>Nombre de marca</label>
              <input
                value={proSettings.brandName}
                onChange={(e) => setProSettings((s) => ({ ...s, brandName: e.target.value }))}
                placeholder="DMC Dental Solution"
              />
              <div className="small">Se usa para títulos/etiquetas (luego lo conectamos global).</div>
            </div>

            <div className="form-field">
              <label>Email de soporte</label>
              <input
                value={proSettings.supportEmail}
                onChange={(e) => setProSettings((s) => ({ ...s, supportEmail: e.target.value }))}
                placeholder="support@dmcdentalsolution.com"
              />
              <div className="small">Contacto para errores o ayuda.</div>
            </div>
          </div>

          <div className="divider" />

          <div className="toggles">
            <Toggle
              title="Modo mantenimiento"
              desc="Si está activo, bloquea secciones para usuarios (lo conectamos luego)."
              value={proSettings.maintenance}
              onChange={(v) => setProSettings((s) => ({ ...s, maintenance: v }))}
            />
            <Toggle
              title="Permitir registro"
              desc="Activa/desactiva la creación de cuentas."
              value={proSettings.allowSignup}
              onChange={(v) => setProSettings((s) => ({ ...s, allowSignup: v }))}
            />
            <Toggle
              title="Requerir confirmación por email"
              desc="Recomendado para seguridad en producción."
              value={proSettings.requireEmailConfirm}
              onChange={(v) => setProSettings((s) => ({ ...s, requireEmailConfirm: v }))}
            />
            <Toggle
              title="Backups habilitados"
              desc="Deja marcado para cuando conectemos Backup real."
              value={proSettings.enableBackups}
              onChange={(v) => setProSettings((s) => ({ ...s, enableBackups: v }))}
            />
            <Toggle
              title="Audit log habilitado"
              desc="Registra acciones (ideal en consultorios)."
              value={proSettings.enableAuditLog}
              onChange={(v) => setProSettings((s) => ({ ...s, enableAuditLog: v }))}
            />
          </div>

          <div className="divider" />

          <div className="footer-note">
            ✅ Esto ya deja la pantalla PRO. Luego conectamos estos toggles a Supabase (tabla settings por clínica).
          </div>
        </div>
      </div>
    </div>
  );
}

// Toggle component
function Toggle({ title, desc, value, onChange }) {
  return (
    <div className="toggle">
      <div className="toggle-left">
        <div className="toggle-title">{title}</div>
        <div className="toggle-desc">{desc}</div>
      </div>

      <button
        className={`switch ${value ? "on" : "off"}`}
        onClick={() => onChange(!value)}
        type="button"
        aria-label={title}
      >
        <span className="dot" />
      </button>
    </div>
  );
}
