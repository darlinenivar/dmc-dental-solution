export default function AppointmentList({ items, onDelete, onUpdate }) {
  if (!items.length) {
    return (
      <div className="card">
        <div className="card-title">Sin citas</div>
        <div className="card-text">Aún no hay citas registradas.</div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-title">Citas</div>
      <div style={{ height: 10 }} />

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Doctor</th>
              <th>Motivo</th>
              <th>Estado</th>
              <th style={{ width: 220 }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {items.map((c) => (
              <tr key={c.id}>
                <td>{c.fecha}</td>
                <td>{c.hora}</td>
                <td>{c.doctor}</td>
                <td>{c.motivo}</td>
                <td>
                  <span className={`badge badge-${badgeKey(c.estado)}`}>{c.estado}</span>
                </td>
                <td>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <select
                      className="input select-sm"
                      value={c.estado}
                      onChange={(e) => onUpdate(c, { estado: e.target.value })}
                    >
                      <option>Programada</option>
                      <option>Confirmada</option>
                      <option>En sala</option>
                      <option>Completada</option>
                      <option>Cancelada</option>
                    </select>

                    <button className="btn btn-danger btn-sm" onClick={() => onDelete(c)}>
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function badgeKey(estado) {
  const s = (estado || "").toLowerCase();
  if (s.includes("confirm")) return "ok";
  if (s.includes("complet")) return "ok";
  if (s.includes("cancel")) return "bad";
  if (s.includes("sala")) return "warn";
  return "neutral";
}
