import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../supabaseClient";
import "../styles/login.css";

export default function Login() {
  const navigate = useNavigate();

  const [mode, setMode] = useState("password"); // "password" | "magic"
  const [email, setEmail] = useState(() => localStorage.getItem("dmc_email") || "");
  const [password, setPassword] = useState("");
  const [rememberEmail, setRememberEmail] = useState(() => !!localStorage.getItem("dmc_email"));

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [infoMsg, setInfoMsg] = useState("");

  // ✅ Detecta env en Vercel (si faltan, el login puede “parecer” que se queda cargando)
  const envOk = useMemo(() => {
    const url = import.meta.env.VITE_SUPABASE_URL;
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
    return !!url && !!key;
  }, []);

  useEffect(() => {
    setErrorMsg("");
    setInfoMsg("");
  }, [mode]);

  useEffect(() => {
    if (rememberEmail && email) localStorage.setItem("dmc_email", email);
    if (!rememberEmail) localStorage.removeItem("dmc_email");
  }, [rememberEmail, email]);

  function withTimeout(promise, ms = 15000) {
    let t;
    const timeout = new Promise((_, reject) => {
      t = setTimeout(() => reject(new Error("Tiempo de espera agotado. Revisa internet o Supabase/Vercel env.")), ms);
    });
    return Promise.race([promise, timeout]).finally(() => clearTimeout(t));
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setInfoMsg("");

    if (!envOk) {
      setErrorMsg("Faltan variables en Vercel: VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY.");
      return;
    }

    if (!email.trim()) {
      setErrorMsg("Escribe tu email.");
      return;
    }

    if (mode === "password" && !password) {
      setErrorMsg("Escribe tu contraseña.");
      return;
    }

    setLoading(true);

    try {
      if (mode === "password") {
        const { data, error } = await withTimeout(
          supabase.auth.signInWithPassword({
            email: email.trim(),
            password,
          }),
          15000
        );

        if (error) {
          setErrorMsg(error.message || "No se pudo iniciar sesión.");
          return;
        }

        // ✅ listo: redirige
        if (data?.session) {
          navigate("/", { replace: true }); // App.jsx ya redirige / -> /login o dashboard según tu lógica
          return;
        }

        setErrorMsg("No se creó sesión. Revisa tu usuario/contraseña.");
        return;
      }

      // Magic link
      const { error } = await withTimeout(
        supabase.auth.signInWithOtp({
          email: email.trim(),
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        }),
        15000
      );

      if (error) {
        setErrorMsg(error.message || "No se pudo enviar el link mágico.");
        return;
      }

      setInfoMsg("Te enviamos un link mágico. Revisa tu correo (también Spam).");
    } catch (err) {
      setErrorMsg(err?.message || "Error inesperado iniciando sesión.");
    } finally {
      // ✅ Esto evita que se quede pegado en “Procesando…”
      setLoading(false);
    }
  };

  return (
    <div className="loginShell">
      <div className="loginLeft">
        <div className="brandBlock">
          <div className="brandLogo">DMC</div>
          <div className="brandTitle">DMC Dental Solution</div>
          <div className="brandSub">Gestión clínica • Citas • Pacientes • Facturación</div>
        </div>

        <div className="leftBullets">
          <div className="dot" />
          <div>Conexión segura • Acceso por roles • Multi-clínica</div>
        </div>
      </div>

      <div className="loginRight">
        <form className="loginCard" onSubmit={onSubmit}>
          <div className="loginHeader">
            <h2>Iniciar sesión</h2>
            <p>Accede a tu clínica de forma segura.</p>
          </div>

          <div className="modeTabs">
            <button
              type="button"
              className={`tab ${mode === "password" ? "active" : ""}`}
              onClick={() => setMode("password")}
              disabled={loading}
            >
              Contraseña
            </button>

            <button
              type="button"
              className={`tab ${mode === "magic" ? "active" : ""}`}
              onClick={() => setMode("magic")}
              disabled={loading}
            >
              Link mágico
            </button>
          </div>

          <label className="label">Email</label>
          <input
            className="input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tuemail@correo.com"
            autoComplete="email"
          />

          {mode === "password" && (
            <>
              <label className="label">Contraseña</label>
              <div className="passwordRow">
                <input
                  className="input"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
              </div>

              <div className="rowBetween">
                <label className="checkbox">
                  <input
                    type="checkbox"
                    checked={rememberEmail}
                    onChange={(e) => setRememberEmail(e.target.checked)}
                    disabled={loading}
                  />
                  <span>Recordar mi email</span>
                </label>

                <button
                  type="button"
                  className="linkBtn"
                  onClick={() => navigate("/forgot-password")}
                  disabled={loading}
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
            </>
          )}

          {errorMsg ? <div className="msg error">{errorMsg}</div> : null}
          {infoMsg ? <div className="msg info">{infoMsg}</div> : null}

          <button className="primaryBtn" type="submit" disabled={loading}>
            {loading ? "Procesando..." : mode === "password" ? "Iniciar sesión" : "Enviar link mágico"}
          </button>

          <button
            type="button"
            className="secondaryBtn"
            onClick={() => navigate("/register")}
            disabled={loading}
          >
            Crear cuenta / Registrar clínica
          </button>

          <div className="finePrint">Al continuar, aceptas las políticas de la clínica.</div>
        </form>
      </div>
    </div>
  );
}
