import { createPortal } from "react-dom";
import { useState, useEffect, useRef } from "react";

import {useAddUnit} from "context/units/useUnits";
import { useGetInsurance } from "context/contracts/useInsurance";
import { useUpdateUnit } from "context/units/useUnits";

import saveDocument from "database/saveDocument";
import deleteDocument from "database/deleteDocument";


export default function UnitForm({ show, onHide, initialData = null,
  isEdit = false }) {

  const [isSaving, setIsSaving] = useState(false);
  const savingRef = useRef(false);
  const addUnit = useAddUnit();
  const updateUnit = useUpdateUnit();
  const insuranceContracts = useGetInsurance();

 const [deletedFiles, setDeletedFiles] = useState([]);

 const [originalFiles, setOriginalFiles] = useState([]);

 const emptyForm = {
  marca: "",
  placa: "",
  partida: "",
  revisionFecha: "",
  mtc: "",
  poliza: "",
  soat: "",
  documentos: {
    mtcCheck: false,
    recTecnTractorCheck: false,
    recTecnCarretaCheck: false,
    soatCheck: false,
    polizaCheck: false,
    tarjetaVehicularCheck: false,
    tarjetaVehicularInfo: "",
    permisoMunicipalCheck: false,
  },
  archivos: []
};

const [form, setForm] = useState(
  initialData || emptyForm
);

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

  const uploadedFiles = Array.from(e.target.files);

  const filesWithId = uploadedFiles.map((file) => ({
  blob: file,

  tempId: crypto.randomUUID(),

  savedInDb: false,

  name: file.name,
  size: file.size,
  type: file.type
}));

setForm((prev) => ({
  ...prev,

  archivos: [
    ...prev.archivos,
    ...filesWithId
  ]
}));
};

const removeFile = (fileId) => {

  const fileToDelete =
    form.archivos.find(
      (f) =>
        (f.id || f.tempId) === fileId
    );

  // SOLO SI YA ESTÁ EN DB
  if (fileToDelete?.savedInDb) {

    setDeletedFiles((prev) => [
      ...prev,
      fileToDelete.id
    ]);
  }

  setForm((prev) => ({
    ...prev,
    archivos: prev.archivos.filter(
      (f) =>
        (f.id || f.tempId) !== fileId
    )
  }));
};

const handleSubmit = async () => {

  // BLOQUEAR DOBLE CLICK
  if (savingRef.current) return;

  savingRef.current = true;

  setIsSaving(true);

  try {

    // NUEVO ID SIEMPRE
    const currentUnitId =
      initialData?._id || crypto.randomUUID();

    // ELIMINAR ARCHIVOS
    if (isEdit) {

      for (const fileId of deletedFiles) {

        await deleteDocument(fileId);
      }
    }

    const storedFiles = [];

    for (const file of form.archivos) {

      // ARCHIVO YA GUARDADO
      if (file.savedInDb) {

  storedFiles.push({
    id: file.id,

    name: file.name,

    size: file.size,

    type: file.type,

    blob: file.blob,

    insuranceFileId:
      file.insuranceFileId,

    insuranceType:
      file.insuranceType,

    savedInDb: true
  });

  continue;
}

      // NUEVO ARCHIVO
      const saved = await saveDocument({
        file: file.blob || file,
        module: "units",
        relatedId: currentUnitId,
        category: "legal"
      });

      storedFiles.push({
        ...saved,
        savedInDb: true
      });
    }

    const unitData = {

      _id: currentUnitId,

      placa: form.placa,
      marca: form.marca,

      mtc: form.mtc,

      tarjetaVehicularInfo:
        form.documentos.tarjetaVehicularInfo,

      revisionFecha:
        form.revisionFecha,

      soat: form.soat,
      poliza: form.poliza,

      partida: form.partida,

      archivos: storedFiles,

      documentos: form.documentos,
    };

    if (isEdit) {

      updateUnit(unitData);

    } else {

      addUnit(unitData);
    }

    // LIMPIAR
    setForm(emptyForm);

    setDeletedFiles([]);
    setOriginalFiles([]);

    onHide();

  } catch (error) {

    console.error(error);

  } finally {

    setIsSaving(false);

    savingRef.current = false;
  }
};

const handleInsuranceSelect = async (
  type,
  value
) => {

  const selectedInsurance =
    insuranceContracts.find((item) => {

      if (type === "poliza") {
        return (
          item.tipo !== "SOAT" &&
          item.poliza === value
        );
      }

      if (type === "soat") {
        return (
          item.tipo === "SOAT" &&
          item.poliza === value
        );
      }

      return false;
    });

  if (!selectedInsurance) {
    return;
  }

  // =========================
  // GUARDAR ARCHIVOS EN INDEXEDDB
  // =========================

const savedFiles =
(selectedInsurance.archivos || []).map(
  (file) => ({

    id: file.id,

    tempId: crypto.randomUUID(),

    savedInDb: true,

    name: file.name,

    size: file.size,

    type: file.type,

    blob: file.blob,

    insuranceFileId: file.id,

    insuranceType:
      type === "soat"
        ? "SOAT"
        : "POLIZA"
  })
);  
  // =========================
  // ACTUALIZAR FORM
  // =========================

  setForm((prev) => {

    // ELIMINAR ARCHIVOS ANTERIORES
    const filteredFiles =
      prev.archivos.filter((file) => {

        if (
          type === "soat" &&
          file.insuranceType === "SOAT"
        ) {
          return false;
        }

        if (
          type === "poliza" &&
          file.insuranceType === "POLIZA"
        ) {
          return false;
        }

        return true;
      });

    return {
      ...prev,

      [type]: value,

      archivos: [
        ...filteredFiles,
        ...savedFiles
      ],

      documentos: {
        ...prev.documentos,

        soatCheck:
          type === "soat"
            ? true
            : prev.documentos.soatCheck,

        polizaCheck:
          type === "poliza"
            ? true
            : prev.documentos.polizaCheck
      }
    };
  });
};

useEffect(() => {

  if (initialData) {

    setForm({
  ...initialData,

  archivos:
    (initialData.archivos || []).map(
      (file) => ({
        ...file,
        tempId:
          crypto.randomUUID(),

        savedInDb: true
      })
    )
});

    setOriginalFiles(
      initialData.archivos || []
    );
  }

}, [initialData]);

const isFormValid =
 // CAMPOS
  form.placa &&
  form.marca &&
  form.mtc &&
  form.revisionFecha &&
  form.soat &&
  form.poliza &&
  form.partida &&

  form.documentos.tarjetaVehicularInfo &&

  // CHECKS
  form.documentos.recTecnCarretaCheck &&
  form.documentos.recTecnTractorCheck &&
  form.documentos.soatCheck &&
  form.documentos.polizaCheck &&
  form.documentos.tarjetaVehicularCheck &&
  form.documentos.permisoMunicipalCheck &&
  form.documentos.mtcCheck &&
// ARCHIVOS
  form.archivos.length > 2;

const handleClose = () => {

  // RESTAURAR SI CANCELA
  if (isEdit) {

    setForm((prev) => ({
      ...prev,
      archivos: originalFiles
    }));

    setDeletedFiles([]);
  }

  onHide();
};

  if (!show) return null;

  return createPortal(
    <div className="modal" onClick={handleClose}>
      <div
        className="modal-content unit-form-modal"
        onClick={(e) => e.stopPropagation()}
      >

        {/* HEADER */}
        <div className="modal-header-custom">
          <div>
            <h2 className="title">
              {isEdit
                ? "Editar Unidad"
                : "Registrar Nueva Unidad"}
            </h2>

            <p className="subtitle">
              {isEdit
                ? "Actualice la información técnica y legal."
                : "Configure los parámetros técnicos y legales."}
            </p>
          </div>
        </div>

        {/* BODY */}
        <div className="grid">

          {/* LEFT */}
          <div className="col">

            <label className="label">
              MARCA
            </label>

            <input
              type="text"
              value={form.marca}
              onChange={(e) =>
                setForm({
                  ...form,
                  marca: e.target.value
                })
              }
              placeholder="Ej. VOLVO"
            />

            <label className="label">
              PLACA (TRACTOR/CARRETA)
            </label>

            <input
              type="text"
              value={form.placa}
              onChange={(e) =>
                setForm({
                  ...form,
                  placa: e.target.value
                })
              }
              placeholder="ABC-123"
            />

            <label className="label">
              PARTIDA REGISTRAL DEL VEHICULO
            </label>

            <input
              type="text"
              value={form.partida}
              onChange={(e) =>
                setForm({
                  ...form,
                  partida: e.target.value
                })
              }
              placeholder="12399999"               
            />

            <label className="label">
              REVISION TECNICA (FECHA VENCIMIENTO)
            </label>

            <input
              type="date"
              value={form.revisionFecha}
              onChange={(e) =>
                setForm({
                  ...form,
                  revisionFecha: e.target.value
                })
              }
            />

          </div>

          {/* RIGHT */}
          <div className="col">

            <label className="label">
              MTC
            </label>

            <input
              type="text"
              value={form.mtc}
              onChange={(e) =>
                setForm({
                  ...form,
                  mtc: e.target.value
                })
              }
              placeholder="Codigo de Registro MTC"
            />

            <label className="label">
              POLIZA
            </label>
            <select name="poliza" 
                    value={form.poliza || ""} 
                    onChange={(e)=>
                      handleInsuranceSelect(
                        "poliza",
                        e.target.value
                      )
                    }
            >
              <option value="">Seleccionar poliza...</option>
              
              {insuranceContracts
                  .filter((insurance) =>
                      insurance.poliza?.startsWith("POLIZA-")
                  )
                  .map((insurance) => (
                    <option
                      key={insurance._id}
                      value={insurance.poliza}
                    >
                      {insurance.poliza}
                    </option>
              ))}
            </select>

            <label className="label">
              SOAT
            </label>

            <select name="soat" 
                    value={form.soat || ""} 
                    onChange={(e)=>
                       handleInsuranceSelect(
                          "soat",
                          e.target.value
                        )
                      }
            >
              <option value="">Seleccionar SOAT...</option>
                
                {insuranceContracts
                     .filter((insurance) =>
                      insurance.poliza?.startsWith("SOAT-")
                    )
                     .map((insurance) => (
                      <option
                        key={insurance._id}
                        value={insurance.poliza}
                      >
                        {insurance.poliza}
                      </option>
              ))}
            </select>

          </div>
        </div>

        {/* CHECKLIST */}
        <div className="list-checklist"> 
          CHECKLIST DE DOCUMENTACION
          <div className="checklist">
            <label>
              <input
                type="checkbox"
                checked={form.documentos.mtcCheck}
                onChange={() =>
                  handleCheckbox("mtcCheck")
                }
              />
              MTC TRACTOR
            </label>

            <label>
              <input
                type="checkbox"
                checked={form.documentos.recTecnTractorCheck}
                onChange={() =>
                  handleCheckbox("recTecnTractorCheck")
                }
              />
              REC TECN. TRACTOR BAL-929
            </label>

            <label>
              <input
                type="checkbox"
                checked={form.documentos.recTecnCarretaCheck}
                onChange={() =>
                  handleCheckbox("recTecnCarretaCheck")
                }
              />
              REC TECN. CARRETERA BAL-C3E-970
            </label>

            <label>
              <input
                type="checkbox"
                checked={form.documentos.soatCheck}
                onChange={() =>
                  handleCheckbox("soatCheck")
                }
              />
              SOAT
            </label>

            <label>
              <input
                type="checkbox"
                checked={form.documentos.polizaCheck}
                onChange={() =>
                  handleCheckbox("polizaCheck")
                }
              />
              POLIZA
            </label>
            
            <div className="check-item">
             <label className="check-row">
              <input
                type="checkbox"
                checked={form.documentos.tarjetaVehicularCheck}
                onChange={() =>
                  handleCheckbox("tarjetaVehicularCheck")
                }
              />
              TARJETA DE IDENTIFICACION VEHICULAR
            </label>
                <input
                  className="property-card-in"
                  type="text"
                  name="tarjetaVehicularInfo"
                  value={form.documentos.tarjetaVehicularInfo || ""}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      documentos: {
                        ...form.documentos,
                        tarjetaVehicularInfo: e.target.value
                      }
                    })
                  }
                  placeholder="TARJETA DE IDENTIFICACION VEHICULAR"
                />
            </div>

            <label>
              <input
                type="checkbox"
                checked={form.documentos.permisoMunicipalCheck}
                onChange={() =>
                  handleCheckbox("permisoMunicipalCheck")
                }
              />
              PERMISO DE LA MUNICIPALIDAD
            </label>
          </div>
        </div>

          <div className="upload">
            DOCUMENTACION LEGAL (SUBE LOS DOCUMENTOS CHECKEADOS)
            <label className="upload-box">
              
              <input
                type="file"
                multiple
                onChange={handleFiles}
              />

              <div className="upload-content">
                <p>Subir archivos</p>
              </div>
            </label>
            {form.archivos.length > 0 && (
                  <div className="unit-file-list">

                    {form.archivos.map((file) => (
                      <div
                        key={file.id || file.tempId}
                        className="unit-file-row"
                      >

                        <div className="unit-file-info">

                          <div className="unit-file-icon">
                            📄
                          </div>

                          <div className="unit-file-text">

                            <p className="unit-file-name">
                              {file.name}
                            </p>

                            <span className="unit-file-size">
                              {(
                                (file.blob?.size || file.size || 0) /
                                1024 /
                                1024
                              ).toFixed(1)} MB
                            </span>

                          </div>

                        </div>

                        <button
                          type="button"
                          className="unit-file-delete"
                          onClick={() =>
                            removeFile(file.id || file.tempId)
                          }
                        >
                          ✕
                        </button>

                      </div>
                    ))}

                  </div>
                )}
          </div>

        {/* ACTIONS */}
        <div className="actions">
          <button
            className="btn-secondary"
            onClick={handleClose}
          >
            Cancelar
          </button>

          <button
            className="btn-primary"
            onClick={handleSubmit}
            disabled={!isFormValid || isSaving}
          >
            {isEdit
              ? "Actualizar Unidad"
              : "Guardar Unidad"}
              
          </button>
        </div>

      </div>
    </div>,
    document.body
  );
}
