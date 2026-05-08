import { createPortal } from "react-dom";
import { useState } from "react";

export default function InsuranceContractForm({
  onHide,
  onSave,
}) {
  const [files, setFiles] = useState([]);
  const [form, setForm] = useState({
    proveedor: "",
    tipo: "",
    poliza: "",
    fechaInicio: "",
    fechaFin: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    const newInsurance = {
      _id: crypto.randomUUID(),
      ...form,
    };

    onSave(newInsurance);
  };

  return createPortal(
    <div className="modal" onClick={onHide}>
      <div
        className="modal-content insurance-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="insurance-form-title">
          Nuevo Contrato de seguro
        </h2>

        <div className="grid">

          <div className="col">

            <label className="label">
              PROVEEDOR
            </label>

            <select
              name="proveedor"
              value={form.proveedor}
              onChange={handleChange}
            >
              <option value="">
                Seleccionar aseguradora...
              </option>

              <option>Rimac</option>
              <option>Pacífico</option>
              <option>Mapfre</option>
              <option>La Positiva</option>
            </select>

          </div>

          <div className="col">

            <label className="label">
              TIPO
            </label>

            <select
              name="tipo"
              value={form.tipo}
              onChange={handleChange}
            >
              <option value="">
                Seleccionar
              </option>

              <option>SOAT</option>
              <option>SCTR</option>
              <option>Seguro Vehicular</option>
            </select>

          </div>

        </div>

        <div className="insurance-dates-grid">

          <div>
            <label className="label">
              NUMERO DE POLIZA
            </label>

            <input
              type="text"
              name="poliza"
              placeholder="Ej. ABC-9999"
              value={form.poliza}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="label">
              FECHA INICIO
            </label>

            <input
              type="date"
              name="fechaInicio"
              value={form.fechaInicio}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="label">
              FECHA FIN
            </label>

            <input
              type="date"
              name="fechaFin"
              value={form.fechaFin}
              onChange={handleChange}
            />
          </div>

        </div>

          <div className="insurance-upload-label">
            DOCUMENTACIÓN LEGAL
            <span> (SUBE LOS DOCUMENTOS DE TU SEGURO)</span>
          </div>

          <label className="upload-box">

            <input
              type="file"
              multiple
              onChange={(e) => {
                const uploadedFiles = Array.from(e.target.files);

                setFiles((prev) => [
                  ...prev,
                  ...uploadedFiles
                ]);
              }}
            />

            <div className="upload-content">
              <div className="icon">☁️</div>

              {files.length === 0 ? (
                <>
                  <p>Arrastra archivos aqui</p>

                  <span>
                    PDF JPG o PNG hasta 10MB
                  </span>
                </>
              ) : (
                <>
                  <p>Click para agregar más archivos</p>
                </>
              )}
            </div>

          </label>
         
             {files.length > 0 && (
              <div className="insurance-file-list">

                {files.map((file, index) => (
                  <div
                    key={index}
                    className="insurance-file-row">

                    <div className="insurance-file-info">

                      <div className="insurance-file-icon">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M7 3H14L19 8V21H7V3Z"
                            stroke="#6b7280"
                            strokeWidth="1.7"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M14 3V8H19"
                            stroke="#6b7280"
                            strokeWidth="1.7"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>

                      <div className="insurance-file-text">
                        <p className="insurance-file-name">
                          {file.name}
                        </p>

                        <span className="insurance-file-size">
                          {(file.size / 1024 / 1024).toFixed(1)} MB
                        </span>
                      </div>

                    </div>

                    <button
                      type="button"
                      className="insurance-file-delete"
                      onClick={() => {
                        setFiles((prev) =>
                          prev.filter((_, i) => i !== index)
                        );
                      }}
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M3 6h18M9 6V4h6v2M10 11v6M14 11v6M5 6l1 14h12l1-14"
                          stroke="#ef4444"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>

                  </div>
                ))}

              </div>
            )}

        <div className="actions">

          <button
            className="btn-secondary"
            onClick={onHide}
          >
            Cancelar
          </button>

          <button
            className="btn-primary"
            onClick={handleSubmit}
          >
            Guardar Contrato
          </button>

        </div>

      </div>
    </div>,
    document.body
  );
}