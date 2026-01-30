import { useProfile } from "../../hooks/useProfile";

export default function DashboardHome() {
  const { clinic } = useProfile();

  return (
    <>
      <h2>Bienvenida 👋</h2>

      <div className="grid">
        <div className="card">
          <h4>Clínica</h4>
          <p>{clinic?.name}</p>
        </div>

        <div className="card">
          <h4>Estado</h4>
          <p>Activo</p>
        </div>

        <div className="card">
          <h4>Seguridad</h4>
          <p>Sesión protegida</p>
        </div>
      </div>
    </>
  );
}
