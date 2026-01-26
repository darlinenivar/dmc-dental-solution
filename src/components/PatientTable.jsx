import { Link } from "react-router-dom";

export default function PatientTable({ items, onEdit, onDelete }) {
  if (!items || items.length === 0) {
    return (
      <div className="card">
        <div className="card-title">Sin pacientes</div>
        <div className="card-text">
          Crea tu primer paciente con el botón “Nuevo paciente”.
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-title">Lista de pacientes</div>
      <div style={{ height: 12 }} />

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Teléfono</th>
              <th>Email</th>
              <th>Documento</th>
              <th style={{ width: 160 }}>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {items.map((p) => (
              <tr key={p.id}>
                <td>
                  <Link className="row-link" to={`/pacientes/${p.id}`}>
                    {p.nombre}
                  </Link>
                </td>
                <td>{p.telefono}</td>
                <td>{p.email || "-"}</td>
                <td>{p.documento || "-"}</td>
                <td>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => onEdit(p)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => onDelete(p)}
                    >
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
