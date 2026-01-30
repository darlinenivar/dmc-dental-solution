import React, { useState } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import { supabase } from "../supabaseClient";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [ok, setOk] = useState(null);
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setErr(null);
    setOk(null);
    setLoading(true);

    const redirectTo = `${window.location.origin}/update-password`;

    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo,
    });

    setLoading(false);

    if (error) {
      setErr(error.message);
      return;
    }

    setOk("Listo ✅ Revisa tu correo. Te enviamos el enlace para cambiar tu contraseña.");
  }

  return (
    <AuthLayout
      title="Recuperar contraseña"
      subtitle="Te enviamos un enlace seguro para actualizarla."
    >
      {err && <div className="alert alertError">{err}</div>}
      {ok && <div className="alert alertOk">{ok}</div>}

      <form className="form" onSubmit={onSubmit}>
        <div>
          <label className="label">Email</label>
          <input
            className="input"
            type="email"
            placeholder="tuemail@clinica.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </div>

        <div className="actions">
          <button className="btn btnPrimary" type="submit" disabled={loading}>
            {loading ? "Enviando..." : "Enviar enlace"}
          </button>

          <Link className="btn btnGhost" to="/login">
            Volver
          </Link>
        </div>
      </form>

      <div className="footerNote">
        Asegúrate de configurar en Supabase → Auth → URL Configuration el redirect a <b>/update-password</b>.
      </div>
    </AuthLayout>
  );
}
