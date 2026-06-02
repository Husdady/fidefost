import { useGetClients } from "context/clients/useClients";
import useGpsContractsStore from "context/contracts/gpsContractsStore";
import { useGetContracts } from "context/contracts/useContracts";
import { useState } from "react";
import { createPortal } from "react-dom";
import saveDocument from "database/saveDocument";
import getDocumentsByRelation from "database/getDocumentsByRelation";
import { useEffect } from "react";
import deleteDocument from "database/deleteDocument";
import { useGetUnits } from "context/units/useUnits";


export default function DriverContractForm({ onHide, onSave, contractData }) {

    const units = useGetUnits();
    
    const getGpsStatus = (endDate) => {
    const today = new Date();

    const contractDate = new Date(endDate);

    const diffTime =
      contractDate - today;

    const diffDays = Math.ceil(
      diffTime / (1000 * 60 * 60 * 24)
    );

    if (diffDays < 0) {
      return {
        text: "SIST. GPS VENCIDO",
        color: "#df2f26",
      };
    }

    if (diffDays <= 30) {
      return {
        text: "SIST. GPS POR VENCER",
        color: "#d97706",
      };
    }

    return {
      text: "SIST. GPS ACTIVO",
      color: "#15803d",
    };
  };
   const [form, setForm] = useState({
    conductor: "",
    gpsId: "",
    licencia: "",
    inducciones: "",
    fechaVencimiento: "",
    unidad: {
      placaTractor: "",
      placaCarreta: "",
      marca: "",
    },
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

  const contracts = useGetContracts();

  //SELECT GPS UNICO
  const usedGpsIds = contracts
  .filter((contract) => contract.gpsId)
  .map((contract) => contract.gpsId);

  const availableGps = gpsContracts.filter((gps) => {

    // SI ESTÁ EDITANDO
    // DEJAR SU GPS ACTUAL
    if (
      contractData &&
      gps.id === contractData.gpsId
    ) {
      return true;
    }

    // OCULTAR GPS YA UTILIZADOS
    return !usedGpsIds.includes(gps.id);
  });

  //SELECT UNIDADES UNICAS
  const usedUnits = contracts
  .map((contract) => contract.auditUnidad)
  .filter(Boolean)
  .map((u) =>
    `${u.placaTractor}-${u.placaCarreta}-${u.marca}`
  );

  const availableUnits = units.filter((unit) => {

  const unitValue =
    `${unit.placaTractor}-${unit.placaCarreta}-${unit.marca}`;

  if (
    contractData &&
    contractData.auditUnidad &&
    unitValue ===
      `${contractData.auditUnidad.placaTractor}-${contractData.auditUnidad.placaCarreta}-${contractData.auditUnidad.marca}`
  ) {
    return true;
  }

  return !usedUnits.includes(unitValue);
});

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
  
  const [errorMessage, setErrorMessage] = useState("");

  const operators = useGetClients();
  const calculateDays = (start, end) => {
  if (!start || !end) return 0;

  const d1 = new Date(start);
  const d2 = new Date(end);

  const diff = d2 - d1;
  return Math.floor(diff / (1000 * 60 * 60 * 24));
};

  useEffect(() => {
    console.log("FORM COMPLETO:", form);
    if (!contractData) return;

    setForm((prev) => ({
      ...prev,
      conductor: contractData.auditDriver,
      unidad: contractData.auditUnidad || {
        placaTractor: "",
        placaCarreta: "",
        marca: "",
      },
      gpsId: contractData.gpsId || "",
      licencia: contractData.auditLicense || "",
      fechaInicio: contractData.auditContract?.start,
      fechaFin: contractData.auditContract?.end,
      inducciones: contractData.auditInductions || "",
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

     let newValue = value;

  // SOLO LETRAS Y MAYUSCULAS PARA CONDUCTOR
  if (name === "conductor") {
    newValue = value
      .replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ\s]/g, "")
      .toUpperCase();
  }
    setForm({ ...form, [name]: newValue });
  };

  const handleUnitChange = (e) => {
  const selectedId = e.target.value;

  const selectedUnit = units.find(
    (u) => u._id === selectedId
  );

  if (!selectedUnit) return;

  setForm((prev) => ({
    ...prev,
    unidad: {
      _id: selectedUnit._id, // 👈 CLAVE
      placaTractor: selectedUnit.placaTractor,
      placaCarreta: selectedUnit.placaCarreta,
      marca: selectedUnit.marca,
    },
  }));
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

          const normalizedFiles =
            uploadedFiles.map((file) => ({
              tempId: crypto.randomUUID(),
              blob: file,
              name: file.name,
              size: file.size,
              type: file.type,
            }));

          setForm((prev) => ({
            ...prev,
            archivos: [
              ...prev.archivos,
              ...normalizedFiles
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

  // eliminar SOLO el archivo exacto
  setForm((prev) => ({
    ...prev,
    archivos: prev.archivos.filter(
      (f) =>
        (f.id || f.tempId) !==
        (file.id || file.tempId)
    )
  }));
};

const handleSubmit = async () => {
  
  const driverAlreadyExists = contracts.some(
    (contract) => {

      // SI ESTÁ EDITANDO
      // IGNORAR EL MISMO CONTRATO
      if (
        contractData &&
        contract._id === contractData._id
      ) {
        return false;
      }

      return (
        contract.auditDriver
          ?.trim()
          .toLowerCase() ===
        form.conductor
          ?.trim()
          .toLowerCase()
      );
    }
  );

  if (driverAlreadyExists) {

   setErrorMessage(
      "INGRESAR OTRO NOMBRE, Este conductor ya se encuentra registrado."
    );

    return;
  }
  setErrorMessage("");

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
      file: file.blob,
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

    auditInductions:
      form.inducciones,

    auditLicenseExpiration:
      form.fechaVencimiento,

    auditOperationalStatus:
      "EN RUTA"
  };
  console.log("NEW AUDIT:", newAudit);

  onSave(newAudit, !!contractData);
};

const isFormValid =

  // CAMPOS
  form.unidad &&
  form.conductor &&
  form.licencia &&
  form.fechaInicio &&
  form.fechaFin &&
  form.inducciones &&
  form.fechaVencimiento &&

  // CHECKS
  form.documentos.brevete &&
  form.documentos.dni &&
  form.documentos.sctr &&
  form.documentos.antecedentesPenales &&
  form.documentos.antecedentesPoliciales &&
  form.documentos.induccion &&

  // ARCHIVOS
  form.archivos.length > 5;

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

            <label className="label">UNIDAD (TRACTOR/MARCA)</label>
            <select
              name="unidad"
              value={form.unidad?._id || ""}
              onChange={handleUnitChange}
            >
              <option value="">Seleccionar unidad...</option>

              {availableUnits.map((unit) => (
                <option
                  key={unit._id}
                  value={unit._id}
                >
                  {unit.placaTractor} - {unit.marca}
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
                  name="inducciones"
                  value={form.inducciones || ""}
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

                {availableGps.map((gps) => (
                  <option
                    key={gps._id}
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
            <input
              type="file"
              multiple
              onChange={(e) => {
                handleFiles(e);

                // permitir volver a subir
                // el mismo archivo
                e.target.value = "";
              }}
            />

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

                  return(
                  <div
                    key={file.id || file.tempId}
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

          {errorMessage && (
            <div className="form-error-message">
              {errorMessage}
            </div>
          )}

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