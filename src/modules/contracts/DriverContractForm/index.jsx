import { useState } from "react";
import { createPortal } from "react-dom";

export default function DriverContractForm({ onHide }) {
  const [form, setForm] = useState({
    operador: "",
    conductor: "",
    unidad: "",
    fechaInicio: "",
    fechaFin: "",
    documentos: {
      brevete: false,
      dni: false,
      sctr: false,
      antecedentesPenales: false,
      antecedentesPoliciales: false,
    },
    wifi: false,
    gps: true,
    archivos: []
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleCheckbox = (name) => {
    setForm({
      ...form,
      documentos: {
        ...form.documentos,
        [name]: !form.documentos[name]
      }
    });
  };

  const handleToggle = (name) => {
    setForm({ ...form, [name]: !form[name] });
  };

  const handleFiles = (e) => {
    setForm({ ...form, archivos: e.target.files });
  };

  const handleSubmit = () => {
    console.log(form);
  };

  return createPortal(
    <div className="modal" onClick={onHide}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <h2>Nuevo Contrato Conductor</h2>

        {/* SELECTS */}
        <div className="row">
          <select name="operador" onChange={handleChange}>
            <option>Seleccionar operador...</option>
          </select>

          <select name="conductor" onChange={handleChange}>
            <option>Seleccionar conductor...</option>
          </select>
        </div>

        <div className="row">
          <select name="unidad" onChange={handleChange}>
            <option>Seleccionar unidad...</option>
          </select>

          <input type="date" name="fechaInicio" onChange={handleChange} />
          <input type="date" name="fechaFin" onChange={handleChange} />
        </div>

        {/* CHECKLIST */}
        <div className="checklist">
          <label>
            <input type="checkbox" onChange={() => handleCheckbox("brevete")} />
            Brevete
          </label>

          <label>
            <input type="checkbox" onChange={() => handleCheckbox("dni")} />
            DNI
          </label>

          <label>
            <input type="checkbox" onChange={() => handleCheckbox("sctr")} />
            SCTR Vincula
          </label>

          <label>
            <input type="checkbox" onChange={() => handleCheckbox("antecedentesPenales")} />
            Antecedentes Penales
          </label>

          <label>
            <input type="checkbox" onChange={() => handleCheckbox("antecedentesPoliciales")} />
            Antecedentes Policiales
          </label>
        </div>

        {/* TOGGLES */}
        <div className="toggles">
          <label>
            WiFi
            <input
              type="checkbox"
              checked={form.wifi}
              onChange={() => handleToggle("wifi")}
            />
          </label>

          <label>
            GPS
            <input
              type="checkbox"
              checked={form.gps}
              onChange={() => handleToggle("gps")}
            />
          </label>
        </div>

        {/* FILE UPLOAD */}
        <div className="upload">
          <input type="file" multiple onChange={handleFiles} />
        </div>

        {/* ACTIONS */}
        <div className="actions">
          <button onClick={onHide}>Cancelar</button>
          <button onClick={handleSubmit}>Guardar Contrato</button>
        </div>

      </div>
    </div>,
    document.body
  );
}