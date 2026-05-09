export default function GpsContractForm({
  show,
  onHide,
}) {
  if (!show) return null;

  return (
    <div className="gps-modal">
      <div className="gps-modal__content">

        <h2 className="gps-modal__title">
          Nuevo Contrato GPS
        </h2>

        <div className="gps-modal__form">

          <div className="gps-modal__field">
            <label>ID</label>

            <input
              type="text"
              placeholder="GPS-AX-882"
            />
          </div>

          <div className="gps-modal__field">
            <label>UNIDAD</label>

            <select>
              <option value="">
                Seleccionar unidad
              </option>

              <option value="unidad-1">
                Unidad 001
              </option>

              <option value="unidad-2">
                Unidad 002
              </option>

              <option value="unidad-3">
                Unidad 003
              </option>
            </select>
          </div>

          <div className="gps-modal__field">
            <label>Fecha instalación</label>

            <input type="date" />
          </div>

          <div className="gps-modal__field">
            <label>Fecha fin contrato</label>

            <input type="date" />
          </div>

        </div>

        <div className="gps-modal__actions">
          <button onClick={onHide}>
            Cancelar
          </button>

          <button>
            Guardar
          </button>
        </div>

      </div>
    </div>
  );
}