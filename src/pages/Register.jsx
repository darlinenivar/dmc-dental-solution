import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    lastName: "",
    email: "",
    password: "",
    clinic: "",
    country: "United States",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          first_name: form.name,
          last_name: form.lastName,
          clinic_name: form.clinic,
          country: form.country,
        },
      },
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    navigate("/login");
  };

  return (
    <div className="auth-container">
      <form className="auth-card" onSubmit={handleRegister}>
        <h2>Crear cuenta</h2>

        {error && <p className="auth-error">{error}</p>}

        <input name="name" placeholder="Nombre" onChange={handleChange} required />
        <input name="lastName" placeholder="Apellido" onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
        <input name="password" type="password" placeholder="Contraseña" onChange={handleChange} required />
        <input name="clinic" placeholder="Nombre de la clínica" onChange={handleChange} required />

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "Creando..." : "Crear cuenta"}
        </button>

        <div className="auth-links">
          <Link to="/login">Login ahora</Link>
          <Link to="/">Volver al inicio</Link>
        </div>
      </form>
    </div>
  );
}
