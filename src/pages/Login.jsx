import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

const TEXT = {
  es: {
    title: "DMC Dental Solution",
    subtitle: "Gestión clínica moderna • Segura • Profesional",
    email: "Correo",
    password: "Contraseña",
    login: "Iniciar sesión",
    creating: "Creando cuenta…",
    signup: "Crear cuenta",
    forgot: "Olvidé mi contraseña",
    reset: "Enviar enlace de recuperación",
    back: "Volver",
    or: "o",
    msgEnterEmail: "Escribe tu correo",
    msgEnterPass: "Escribe tu contraseña",
    msgOkLogin: "¡Listo! Entrando…",
    msgOkSignup: "Cuenta creada. Revisa tu correo si requiere confirmación.",
    msgOkReset: "Te enviamos un enlace a tu correo para recuperar la contraseña.",
    lang: "EN",
  },
  en: {
    title: "DMC Dental Solution",
    subtitle: "Modern clinic management • Secure • Professional",
    email: "Email",
    password: "Password",
    login: "Sign in",
    creating: "Creating account…",
    signup: "Create account",
    forgot: "Forgot password",
    reset: "Send reset link",
    back: "Back",
    or: "or",
    msgEnterEmail: "Enter your email",
    msgEnterPass: "Enter your password",
    msgOkLogin: "Done! Signing you in…",
    msgOkSignup: "Account created. Check your email if confirmation is required.",
    msgOkReset: "We sent you a reset link to your email.",
    lang: "ES",
  },
};

export default function Login() {
  const navigate = useNavigate();
  const [lang, setLang] = useState("es");
  const t = useMemo(() => TEXT[lang], [lang]);

  const [mode, setMode] = useState("login"); // login | signup | reset
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  const cleanMsg = () => setMsg("");

  const onLogin = async (e) => {
    e.preventDefault();
    cleanMsg();

    if (!email.trim()) return setMsg(t.msgEnterEmail);
    if (!password.trim()) return setMsg(t.msgEnterPass);

    setBusy(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) throw error;

      setMsg(t.msgOkLogin);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      console.error(err);
      setMsg(err?.message || "Error");
    } finally {
      setBusy(false);
    }
  };

  const onSignup = async (e) => {
    e.preventDefault();
    cleanMsg();

    if (!email.trim()) return setMsg(t.msgEnterEmail);
    if (!password.trim()) return setMsg(t.msgEnterPass);

    setBusy(true);
    try {
      // ✅ Para que el link de confirmación vuelva a tu app
      const redirectTo = `${window.location.origin}/login`;

      const { error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: { emailRedirectTo: redirectTo },
      });

      if (error) throw error;
      setMsg(t.msgOkSignup);
    } catch (err) {
      console.error(err);
      setMsg(err?.message || "Error");
    } finally {
      setBusy(false);
    }
  };

  const onReset = async (e) => {
    e.preventDefault();
    cleanMsg();

    if (!email.trim()) return setMsg(t.msgEnterEmail);

    setBusy(true);
    try {
      const redirectTo = `${window.location.origin}/login`;

      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo,
      });

      if (error) throw error;
      setMsg(t.msgOkReset);
    } catch (err) {
      console.error(err);
      setMsg(err?.message || "Error");
    } finally {
      setBusy(false);
    }
  };

  const submitHandler =
    mode === "login" ? onLogin : mode === "signup" ? onSignup : onReset;

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-left">
          <div className="login-brand">
            <div className="login-logo">DMC</div>
            <button
              className="lang-btn"
              type="button"
              onClick={() => setLang((v) => (v === "es" ? "en" : "es"))}
            >
              {t.lang}
            </button>
          </div>

          <h1 className="login-title">{t.title}</h1>
          <p className="login-subtitle">{t.subtitle}</p>

          <div className="login-badge">
            <span className="dot" /> 
          </div>
        </div>

        <div className="login-right">
          <h2 className="form-title">
            {mode === "login"
              ? t.login
              : mode === "signup"
              ? t.signup
              : t.forgot}
          </h2>

          <form onSubmit={submitHandler} className="login-form">
            <label className="field">
              <span>{t.email}</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@email.com"
                autoComplete="email"
              />
            </label>

            {mode !== "reset" && (
              <label className="field">
                <span>{t.password}</span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete={
                    mode === "login" ? "current-password" : "new-password"
                  }
                />
              </label>
            )}

            {msg && <div className="msg">{msg}</div>}

            <button className="primary" type="submit" disabled={busy}>
              {busy
                ? mode === "signup"
                  ? t.creating
                  : "…"
                : mode === "login"
                ? t.login
                : mode === "signup"
                ? t.signup
                : t.reset}
            </button>

            {mode === "login" && (
              <>
                <button
                  type="button"
                  className="link"
                  onClick={() => setMode("reset")}
                  disabled={busy}
                >
                  {t.forgot}
                </button>

                <div className="divider">
                  <span>{t.or}</span>
                </div>

                <button
                  type="button"
                  className="secondary"
                  onClick={() => setMode("signup")}
                  disabled={busy}
                >
                  {t.signup}
                </button>
              </>
            )}

            {mode !== "login" && (
              <button
                type="button"
                className="secondary"
                onClick={() => setMode("login")}
                disabled={busy}
              >
                ← {t.back}
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
