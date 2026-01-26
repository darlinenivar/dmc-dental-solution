export default function NuevoPaciente({ onClose }) {
  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>Nuevo paciente</h2>

        <div className="form-grid">
          <input placeholder="Nombre *" />
          <input placeholder="Apellido *" />
          <input type="date" />
          <select>
            <option>Género</option>
            <option>Masculino</option>
            <option>Femenino</option>
          </select>
          <input placeholder="Contacto *" />
          <input placeholder="Contacto emergencia *" />
          <textarea placeholder="Alergias *"></textarea>
          <input placeholder="Email" />
          <textarea placeholder="Nota"></textarea>
        </div>

        <div className="modal-actions">
          <button onClick={onClose}>Cancelar</button>
          <button className="btn-primary">Guardar</button>
        </div>
      </div>
    </div>
  );
}
