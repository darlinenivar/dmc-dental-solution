import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const run = async () => {
      try {
        // Confirmar sesión
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          navigate("/login", { replace: true });
          return;
        }

        // Guardar datos básicos
        localStorage.setItem("userId", session.user.id);
        localStorage.setItem("userEmail", session.user.email);

        // Redirigir al dashboard
        navigate("/dashboard", { replace: true });
      } catch (e) {
        console.error("AuthCallback error:", e);
        navigate("/login", { replace: true });
      }
    };

    run();
  }, [navigate]);

  return null;
}
