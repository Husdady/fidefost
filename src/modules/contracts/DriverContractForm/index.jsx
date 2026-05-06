import { useGetClients } from "context/clients/useClients";
import { useState } from "react";
import { createPortal } from "react-dom";
import saveDocument from "database/saveDocument";
import getDocumentsByRelation from "database/getDocumentsByRelation";
import { useEffect } from "react";
import { deleteDocument } from "database/deleteDocument";


export default function DriverContractForm({ onHide, onSave, contractData }) {
  const [contractId] = useState(() => contractData?._id || Date.now().toString());
  const operators = useGetClients();
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

  useEffect(() => {
    if (!contractData) return;

    setForm((prev) => ({
      ...prev,
      conductor: contractData.auditDriver,
      fechaInicio: contractData.auditContract?.start,
      fechaFin: contractData.auditContract?.end,
    }));
  }, [contractData]);
  
  useEffect(() => {
  const loadFiles = async () => {
    if (!contractId) return;

    const files = await getDocumentsByRelation("contracts", contractId);

    setForm((prev) => ({
      ...prev,
      archivos: files
    }));
  };

  loadFiles();
}, [contractId]);

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

  const handleFiles = async (e) => {
    const files = Array.from(e.target.files);
    const savedFiles = [];

    for (const file of files) {
      const saved = await saveDocument({
        file,
        module: "contracts",
        relatedId: contractId, 
        category: "legal"
      });

      savedFiles.push(saved);
    }

    setForm((prev) => ({
      ...prev,
      archivos: [...prev.archivos, ...savedFiles]
    }));
  };

  const removeFile = async (fileId) => {
  await deleteDocument(fileId);

  setForm((prev) => ({
    ...prev,
    archivos: prev.archivos.filter(f => f.id !== fileId)
  }));
};

const handleSubmit = () => {
  const dias = calculateDays(form.fechaInicio, form.fechaFin);

  const newAudit = {
    ...contractData, 

    _id: contractId,

    auditDriver: form.conductor,
    auditContract: {
      start: form.fechaInicio,
      end: form.fechaFin,
      days: dias
    },

    auditLicense: "OK",
    auditOperationalStatus: "EN RUTA"
  };

  onSave(newAudit, !!contractData);
};

  return createPortal(
    <div className="modal" onClick={onHide}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="title">
          {contractData ? "Editar Contrato" : "Nuevo Contrato Conductor"}

        </h2>
        <p className="subtitle">
          Configure los parámetros operativos para la nueva unidad.
        </p>

        <div className="grid">

          {/* IZQUIERDA */}
          <div className="col">

            <label className="label">EMPRESA OPERADORA</label>
            <select name="operador" onChange={handleChange}>
              <option value="">Seleccionar operador...</option>

              {operators.map((op) => (
                <option key={op._id} value={op.operatorName}>
                  {op.operatorName}
                </option>
              ))}
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
              value={form.conductor}
              placeholder="Seleccionar conductor..."
              onChange={handleChange}
            />

            <div className="row-2">
              <div>
                <label className="label">FECHA INICIO</label>
                <input
                  type="date" 
                  name="fechaInicio" 
                  value={form.fechaInicio || ""}
                  onChange={handleChange} 
                />
          
              </div>

              <div>
                <label className="label">FECHA FIN</label>
                <input 
                  type="date" 
                  name="fechaFin" 
                  value={form.fechaFin || ""}
                  onChange={handleChange} 
                />
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

              {form.archivos.length === 0 ? (
                <>
                  <p>Arrastra archivos aquí</p>
                  <span>PDF, JPG o PNG hasta 10MB</span>
                </>
              ) : (
                <>
                 <p>Click para agregar más archivos</p>
                </>
              )}

            </div>
          </label>
              {form.archivos.length > 0 && (
              <div className="file-list">
                {form.archivos.map((file, index) =>  {
                  console.log("FILE ID:", file.id);

                  return(
                  <div key={file.id} className="file-row">
                    
                    <div className="file-left">
                      <span className="file-icon">📄</span>

                      <div>
                        <p className="file-name">{file.name}</p>
                        <span className="file-size">
                          {(file.size / 1024 / 1024).toFixed(1)} MB
                        </span>
                      </div>
                    </div>
                
                    <button
                      className="file-delete"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(file.id);
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
                          stroke="#dc2626"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>

                  </div>
                )})}
              </div>
            )}

          </div>

        {/* ACTIONS */}
        <div className="actions">
          <button className="btn-secondary" onClick={onHide}>Cancelar</button>
          <button 
            type="button"
            className="btn-primary" 
            onClick={handleSubmit}
          >
            {contractData ? "Actualizar Contrato" : "Guardar Contrato"}
          </button>
        </div>

      </div>
    </div>,
    document.body
  );
}