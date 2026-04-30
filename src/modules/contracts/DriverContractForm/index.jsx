import { useState } from "react";
import { createPortal } from "react-dom";


export default function DriverContractForm({ onHide, onSave }) {
  
  const calculateDays = (start, end) => {
  if (!start || !end) return 0;

  const d1 = new Date(start);
  const d2 = new Date(end);

  const diff = d2 - d1;
  return Math.floor(diff / (1000 * 60 * 60 * 24));
};
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
    const dias = calculateDays(form.fechaInicio, form.fechaFin);
    
    const newAudit = {
      _id: Date.now(),

      auditDriver: form.conductor,
      auditContract: {
        start: form.fechaInicio,
        end: form.fechaFin,
        days: dias
      },
      auditLicense: "OK",
      auditOperationalStatus: "EN RUTA"
    };

    onSave(newAudit); //  ENVÍA A LA TABLA
  };

  return createPortal(
    <div className="modal" onClick={onHide}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="title">Nuevo Contrato Conductor</h2>
        <p className="subtitle">
          Configure los parámetros operativos para la nueva unidad.
        </p>

        <div className="grid">

          {/* IZQUIERDA */}
          <div className="col">

            <label className="label">EMPRESA OPERADORA</label>
            <select name="operador" onChange={handleChange}>
              <option>Seleccionar operador...</option>
            </select>

            <label className="label">UNIDAD (TRACTOR / PLACA)</label>
            <select name="unidad" onChange={handleChange}>
              <option>Seleccionar unidad...</option>
            </select>

            <label className="label">CHECKLIST DE DOCUMENTACIÓN</label>
            <div className="checklist">
              <label><input type="checkbox" onChange={() => handleCheckbox("brevete")} /> Brevete</label>
              <label><input type="checkbox" onChange={() => handleCheckbox("dni")} /> DNI</label>
              <label><input type="checkbox" onChange={() => handleCheckbox("sctr")} /> SCTR Vincula</label>
              <label><input type="checkbox" onChange={() => handleCheckbox("antecedentesPenales")} /> Antecedentes Penales</label>
              <label><input type="checkbox" onChange={() => handleCheckbox("antecedentesPoliciales")} /> Antecedentes Policiales</label>
            </div>

          </div>

          {/* DERECHA */}
          <div className="col">

            <label className="label">CONDUCTOR ASIGNADO</label>
            <input
              type="text"
              name="conductor"
              placeholder="Seleccionar conductor..."
              onChange={handleChange}
            />

            <div className="row-2">
              <div>
                <label className="label">FECHA INICIO</label>
                <input type="date" name="fechaInicio" onChange={handleChange} />
              </div>

              <div>
                <label className="label">FECHA FIN</label>
                <input type="date" name="fechaFin" onChange={handleChange} />
              </div>
            </div>

            <label className="label">EQUIPAMIENTO DE TELEMETRÍA</label>

            <div className="card">
              <div>
                <strong>Módulo WiFi</strong>
                <p>Transmisión en tiempo real</p>
              </div>
              <input
                type="checkbox"
                checked={form.wifi}
                onChange={() => handleToggle("wifi")}
              />
            </div>

            <div className="card">
              <div>
                <strong>GPS Tracker</strong>
                <p>Geolocalización satelital</p>
              </div>
              <input
                type="checkbox"
                checked={form.gps}
                onChange={() => handleToggle("gps")}
              />
            </div>

          </div>

        </div>

        {/* UPLOAD */}
          <div className="upload">
            <label className="upload-box">
              <input type="file" multiple onChange={handleFiles} />

              <div className="upload-content">
                <div className="icon">☁️</div>
                <p>Arrastra archivos aquí</p>
                <span>PDF, JPG o PNG hasta 10MB</span>
              </div>
            </label>
          </div>

        {/* ACTIONS */}
        <div className="actions">
          <button className="btn-secondary" onClick={onHide}>Cancelar</button>
          <button className="btn-primary" onClick={handleSubmit}>Guardar Contrato</button>
        </div>

      </div>
    </div>,
    document.body
  );
}