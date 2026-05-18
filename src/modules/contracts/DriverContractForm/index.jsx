import { useGetClients } from "context/clients/useClients";
import useGpsContractsStore from "context/contracts/gpsContractsStore";
import { useState } from "react";
import { createPortal } from "react-dom";
import saveDocument from "database/saveDocument";
import getDocumentsByRelation from "database/getDocumentsByRelation";
import { useEffect } from "react";
import deleteDocument from "database/deleteDocument";
import { useGetUnits } from "context/units/useUnits";


export default function DriverContractForm({ onHide, onSave, contractData }) {

    const units = useGetUnits();
    const [selectedGps, setSelectedGps] = useState("");
    const getGpsStatus = (endDate) => {
    const today = new Date();

    const contractDate = new Date(endDate);

    const diffTime =
      contractDate - today;

    const diffDays = Math.ceil(
      diffTime / (1000 * 60 * 60 * 24)
    );

    if (diffDays <= 0) {
      return {
        text: "SIST. GPS VENCIDO",
        color: "#e53935",
      };
    }

    if (diffDays <= 30) {
      return {
        text: "SIST. GPS POR VENCER",
        color: "#ff9800",
      };
    }

    return {
      text: "SIST. GPS ACTIVO",
      color: "#1db954",
    };
  };
   const [form, setForm] = useState({
    operador: "",
    conductor: "",
    gpsId: "",
    licencia: "",
    fechaInduccion: "",
    fechaVencimiento: "",
    unidad: "",
    fechaInicio: "",
    fechaFin: "",
    documentos: {
      brevete: false,
      dni: false,
      sctr: false,
      antecedentesPenales: false,
      antecedentesPoliciales: false,
      induccion: false,
    },
    wifi: false,
    gps: true,
    archivos: []
  });

  const gpsContracts = useGpsContractsStore(
    (state) => state.gpsContracts
  );

  const gpsSelectedData = gpsContracts.find(
    (gps) => gps.id === form.gpsId
  );

  const gpsStatus = gpsSelectedData
  ? getGpsStatus(
      gpsSelectedData.endDate
    )
  : null;

  const [contractId] = useState(() => contractData?._id || Date.now().toString());
  
  const [deletedFiles, setDeletedFiles] = useState([]);

  const [originalFiles, setOriginalFiles] = useState([]);

  const operators = useGetClients();
  const calculateDays = (start, end) => {
  if (!start || !end) return 0;

  const d1 = new Date(start);
  const d2 = new Date(end);

  const diff = d2 - d1;
  return Math.floor(diff / (1000 * 60 * 60 * 24));
};

  useEffect(() => {
    if (!contractData) return;

    setForm((prev) => ({
      ...prev,
      operador: contractData.operador || "",
      conductor: contractData.auditDriver,
      unidad: contractData.auditUnidad || "",
      gpsId: contractData.gpsId || "",
      licencia: contractData.auditLicense || "",
      fechaInicio: contractData.auditContract?.start,
      fechaFin: contractData.auditContract?.end,
      fechaInduccion: contractData.auditInductionDate || "",
      fechaVencimiento: contractData.auditLicenseExpiration || "",
      documentos: contractData.documentos || prev.documentos,
      wifi: contractData.wifi ?? prev.wifi,
      gps: contractData.gps ?? prev.gps,
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

setOriginalFiles(files);
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

  const handleFiles = (e) => {

  const uploadedFiles =
    Array.from(e.target.files);

  setForm((prev) => ({
    ...prev,
    archivos: [
      ...prev.archivos,
      ...uploadedFiles
    ]
  }));
};

  const removeFile = (file) => {

  // marcar para eliminar después
  if (file.id) {

    setDeletedFiles((prev) => [
      ...prev,
      file.id
    ]);
  }

  // solo quitar visualmente
  setForm((prev) => ({
    ...prev,
    archivos: prev.archivos.filter(
      (f) => f !== file
    )
  }));
};

const handleSubmit = async () => {

  // eliminar definitivos
  // solo al actualizar
  if (contractData) {

    for (const fileId of deletedFiles) {

      await deleteDocument(fileId);
    }
  }

  const storedFiles = [];

  for (const file of form.archivos) {

    // ya existe en indexeddb
    if (file.id) {

      storedFiles.push(file);

      continue;
    }

    // guardar nuevos archivos
    const saved = await saveDocument({
      file,
      module: "contracts",
      relatedId: contractId,
      category: "legal"
    });

    storedFiles.push(saved);
  }

  const dias = calculateDays(
    form.fechaInicio,
    form.fechaFin
  );

  const newAudit = {

    ...contractData,

    _id: contractId,

    operador: form.operador,

    auditDriver: form.conductor,

    auditUnidad: form.unidad,

    gpsId: form.gpsId,

    archivos: storedFiles,

    auditContract: {
      start: form.fechaInicio,
      end: form.fechaFin,
      days: dias
    },

    documentos: form.documentos,

    wifi: form.wifi,

    gps: form.gps,

    auditLicense: form.licencia,

    auditInductionDate:
      form.fechaInduccion,

    auditLicenseExpiration:
      form.fechaVencimiento,

    auditOperationalStatus:
      "EN RUTA"
  };

  onSave(newAudit, !!contractData);
};

const isFormValid =

  // CAMPOS
  form.operador &&
  form.unidad &&
  form.conductor &&
  form.licencia &&
  form.fechaInicio &&
  form.fechaFin &&
  form.fechaInduccion &&
  form.fechaVencimiento &&

  // CHECKS
  form.documentos.brevete &&
  form.documentos.dni &&
  form.documentos.sctr &&
  form.documentos.antecedentesPenales &&
  form.documentos.antecedentesPoliciales &&
  form.documentos.induccion &&

  // ARCHIVOS
  form.archivos.length > 0;

  const handleClose = () => {

  // restaurar archivos originales
  if (contractData) {

    setForm((prev) => ({
      ...prev,
      archivos: originalFiles
    }));

    setDeletedFiles([]);
  }

  onHide();
};

  return createPortal(
    <div className="modal" onClick={handleClose}>
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
            <select name="operador" value={form.operador} onChange={handleChange}>
              <option value="">Seleccionar operador...</option>

              {operators.map((op) => (
                <option key={op._id} value={op.operatorName}>
                  {op.operatorName}
                </option>
              ))}
            </select>

            <label className="label">UNIDAD (TRACTOR / PLACA)</label>
            <select name="unidad" value={form.unidad || ""} onChange={handleChange}>
              <option value="">Seleccionar unidad...</option>
              {units.map((unit) => (
                <option
                  key={unit._id}
                  value={`${unit.placa} - ${unit.marca}`}
                >
                  {unit.placa} - {unit.marca}
                </option>
              ))}
            </select>

            <label className="label">CHECKLIST DE DOCUMENTACIÓN</label>
            <div className="checklist">
              <label><input type="checkbox" checked={form.documentos.brevete} onChange={() => handleCheckbox("brevete")} /> Brevete</label>
                <div className="approval-date">
                  <p className="approval-label">Fecha Vencimiento</p>
                  <input
                    className="small-date"
                    type="date"
                    name="fechaVencimiento"
                    value={form.fechaVencimiento || ""}
                    onChange={handleChange}
                />
                </div>

              <label><input type="checkbox" checked={form.documentos.dni} onChange={() => handleCheckbox("dni")} /> DNI</label>
              <label><input type="checkbox" checked={form.documentos.sctr} onChange={() => handleCheckbox("sctr")} /> SCTR Vincula</label>
              <label><input type="checkbox" checked={form.documentos.antecedentesPenales} onChange={() => handleCheckbox("antecedentesPenales")} /> Antecedentes Penales</label>
              <label><input type="checkbox" checked={form.documentos.antecedentesPoliciales} onChange={() => handleCheckbox("antecedentesPoliciales")} /> Antecedentes Policiales</label>
              <label><input type="checkbox" checked={form.documentos.induccion} onChange={() => handleCheckbox("induccion")} /> Inducciones</label>
              <div className="label">
                <p className="label">Agregar Inducciones</p>
                <input
        
                  type="text"
                  name="fechaInduccion"
                  value={form.fechaInduccion || ""}
                  placeholder="Ej: Inducción1, Inducción2..."
                  onChange={handleChange}
                />
              </div>
            </div>

          </div>

          {/* DERECHA */}
          <div className="col">

            <label className="label">CONDUCTOR ASIGNADO</label>
            <input
              type="text"
              name="conductor"
              value={form.conductor}
              placeholder="Agregar conductor..."
              onChange={handleChange}
            />

            <div>
                <label className="label">TIPO DE LICENCIA</label>
                  <select name="licencia" value={form.licencia || ""} onChange={handleChange}>
                    <option value="">
                      Seleccionar T. Licencia...
                    </option>
                    
                    <option value="A-I">A-I</option>
                    <option value="A-IIa">A-IIa</option>
                    <option value="A-IIb">A-IIb</option>
                    <option value="A-IIIa">A-IIIa</option>
                    <option value="A-IIIb">A-IIIb</option>
                    <option value="A-IIIc">A-IIIc</option>
                    <option value="A-IV">A-IV</option>

                  </select>
            </div>


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
                <strong>GPS</strong>
                <p>Geolocalización satelital</p>
              </div>
              <input
                type="checkbox"
                checked={form.gps}
                onChange={() => handleToggle("gps")}
              />
            </div>

            <div className="driver-contract-form__field">
              <label>ID GPS:</label>

              <select
                value={form.gpsId}
                onChange={(e) =>
                  setForm({
                    ...form,
                    gpsId: e.target.value,
                  })
                }
              >
                <option value="">
                  Seleccionar GPS
                </option>

                {gpsContracts.map((gps) => (
                  <option
                    key={gps.id}
                    value={gps.id}
                  >
                    {gps.id}
                  </option>
                ))}
              </select>
            </div>
            <div className="gps-status-info">
              <label>
                Estado GPS:
              </label>

              <span className="gps-status-online"
                style={{
                color: gpsStatus?.color,
                fontWeight: "600",
              }}>
                ● {gpsStatus?.text || "--"}
              </span>
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
                 <p>Click aquí para agregar más archivos</p>
                </>
              )}

            </div>
          </label>
              {form.archivos.length > 0 && (
              <div className="file-list">
                {form.archivos.map((file, index) =>  {
                  console.log("FILE ID:", file.id);

                  return(
                  <div
                    key={file.id || `${file.name}-${index}`}
                    className="file-row"
                  >
                    
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
                        removeFile(file);
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
          <button className="btn-secondary" onClick={handleClose}>Cancelar</button>
          <button 
            type="button"
            className="btn-primary" 
            onClick={handleSubmit}
            disabled={!isFormValid}
          >
            {contractData ? "Actualizar Contrato" : "Guardar Contrato"}
          </button>
        </div>

      </div>
    </div>,
    document.body
  );
}