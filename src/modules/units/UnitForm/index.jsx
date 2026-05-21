import { createPortal } from "react-dom";
import { useState, useEffect, useRef } from "react";

import {useAddUnit} from "context/units/useUnits";
import { useGetUnits } from "context/units/useUnits";
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
  const units = useGetUnits();
  const usedVehicularPolicies = units
  .filter(
    (unit) =>
      unit._id !== initialData?._id
  )
  .map(
    (unit) => unit.polizaVehicular
  )
  .filter(Boolean);

 const [deletedFiles, setDeletedFiles] = useState([]);

 const [originalFiles, setOriginalFiles] = useState([]);

 const emptyForm = {
  marca: "",
  placa: "",
  polizaVehicular: "",
  polizaCarga: "",
  polizaEndoso: "",
  placaTractor: "",
  placaCarreta: "",
  revisionFecha: "",
  mtc: "",
  poliza: "",
  soat: "",
  documentos: {
    mtcCheck: false,
    revisionTecnicaCheck: false,
    soatCheck: false,
    polizaCheck: false,
    tarjetaVehicularCheck: false,
    tarjetaVehicularInfo: "",
    permisoMunicipalCheck: false,
  },
  archivos: []
};
const resetForm = () => {

  setForm(emptyForm);

  setDeletedFiles([]);

  setOriginalFiles([]);

  setIsSaving(false);
};

const [form, setForm] = useState(
  initialData || emptyForm
);

const [showMessageBox, setShowMessageBox] =
  useState(false);

const [messageBoxText, setMessageBoxText] =
  useState("");

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
  
  if (!validateUniqueFields()) {
    return;
  }

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

      placaTractor: form.placaTractor,

      placaCarreta: form.placaCarreta,

      mtc: form.mtc,

      tarjetaVehicularInfo:
        form.documentos.tarjetaVehicularInfo,

      revisionFecha:
        form.revisionFecha,

      soat: form.soat,
      polizaVehicular:
        form.polizaVehicular,

      polizaCarga:
        form.polizaCarga,

      polizaEndoso:
        form.polizaEndoso,

      archivos: storedFiles,

      documentos: form.documentos,
    };

    if (isEdit) {

      updateUnit(unitData);

    } else {

      addUnit(unitData);
    }

    // LIMPIAR
    resetForm();

    onHide();

  } catch (error) {

    console.error(error);

  } finally {

    setIsSaving(false);

    savingRef.current = false;
  }
};

//validacion datos
const validateUniqueFields = () => {

  const duplicatedFields = [];

  units.forEach((unit) => {

    // IGNORAR EL MISMO REGISTRO EN EDICIÓN
    if (
      isEdit &&
      unit._id === initialData?._id
    ) {
      return;
    }

    // PLACA
    if (
      unit.placa === form.placa &&
      form.placa
    ) {
      duplicatedFields.push(
        `PLACA: ${form.placa}`
      );
    }

    // MARCA
    if (
      unit.marca === form.marca &&
      form.marca
    ) {
      duplicatedFields.push(
        `MARCA: ${form.marca}`
      );
    }

    // PLACA TRACTOR
    if (
      unit.placaTractor ===
        form.placaTractor &&
      form.placaTractor
    ) {
      duplicatedFields.push(
        `PLACA TRACTOR: ${form.placaTractor}`
      );
    }

    // PLACA CARRETA
    if (
      unit.placaCarreta ===
        form.placaCarreta &&
      form.placaCarreta
    ) {
      duplicatedFields.push(
        `PLACA CARRETA: ${form.placaCarreta}`
      );
    }

    // MTC
    if (
      unit.mtc === form.mtc &&
      form.mtc
    ) {
      duplicatedFields.push(
        `MTC: ${form.mtc}`
      );
    }

    // IDENTIFICACION VEHICULAR
    if (
      unit.tarjetaVehicularInfo ===
        form.documentos
          .tarjetaVehicularInfo &&
      form.documentos
        .tarjetaVehicularInfo
    ) {
      duplicatedFields.push(
        `IDENTIFICACIÓN VEHICULAR: ${
          form.documentos
            .tarjetaVehicularInfo
        }`
      );
    }
  });

  // ELIMINAR DUPLICADOS REPETIDOS
  const uniqueDuplicatedFields = [
    ...new Set(duplicatedFields)
  ];

  if (
    uniqueDuplicatedFields.length > 0
  ) {

    setMessageBoxText(
      uniqueDuplicatedFields.join("\n")
    );

    setShowMessageBox(true);

    return false;
  }

  return true;
};

const handleInsuranceSelect = async (
  type,
  value
) => {

  const selectedInsurance =
    insuranceContracts.find((item) => {

        if (
    type === "polizaVehicular"
  ) {
    return (
      item.tipo
        ?.toLowerCase()
        .includes("vehicular") &&
      item.poliza === value
    );
  }

  if (
    type === "polizaCarga"
  ) {
    return (
      item.tipo
        ?.toLowerCase()
        .includes("carga") &&
      item.poliza === value
    );
  }

  if (
    type === "polizaEndoso"
  ) {
    return (
      item.tipo
        ?.toLowerCase()
        .includes("endoso") &&
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

      insuranceType: type
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
          file.insuranceType === type
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
          type !== "soat"
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
  
  } else {

    setForm(emptyForm);
  }

}, [initialData]);

const isFormValid =
 // CAMPOS
  form.placa &&
  form.marca &&
  form.mtc &&
  form.revisionFecha &&
  form.soat &&
  form.polizaVehicular &&
  form.polizaCarga &&
  form.placaTractor &&
  form.placaCarreta &&

  form.documentos.tarjetaVehicularInfo &&

  // CHECKS
  form.documentos.revisionTecnicaCheck &&
  form.documentos.soatCheck &&
  form.documentos.polizaCheck &&
  form.documentos.tarjetaVehicularCheck &&
  form.documentos.permisoMunicipalCheck &&
  form.documentos.mtcCheck &&
// ARCHIVOS
  form.archivos.length > 6;

const handleClose = () => {

  resetForm();

  onHide();
};

const usedSoats = units
  .map((unit) => unit.soat)
  .filter(Boolean);
  
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
              className="uppercase-input"
              type="text"
              value={form.marca}
              onChange={(e) =>
                setForm({
                  ...form,
                  marca: e.target.value.toUpperCase()
                })
              }
              placeholder="Ej. VOLVO"
            />

            <label className="label">
              PLACA UNIDAD
              (TRACTOR/CARRETA)
            </label>

            <input
              className="uppercase-input"
              type="text"
              value={form.placa}
              onChange={(e) =>
                setForm({
                  ...form,
                  placa: e.target.value.toUpperCase()
                })
              }
               placeholder="ABC-123"
            />

            <label className="label">
              PLACA TRACTOR
            </label>

            <input
              className="uppercase-input"
              type="text"
              value={form.placaTractor}
              onChange={(e) =>
                setForm({
                  ...form,
                  placaTractor: e.target.value.toUpperCase()
                })
              }
              placeholder="TRACTOR"               
            />

            <label className="label">
              PLACA CARRETA
            </label>

            <input
              className="uppercase-input"
              type="text"
              value={form.placaCarreta}
              onChange={(e) =>
                setForm({
                  ...form,
                  placaCarreta: e.target.value.toUpperCase()
                })
              }
              placeholder="CARRETA"
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
              POLIZAS:
            </label>
              <div>
                <label className="label">
                  POLIZA VEHICULAR
                </label>

                <select
                  name="polizaVehicular"
                  value={form.polizaVehicular || ""}
                  onChange={(e) =>
                    handleInsuranceSelect(
                      "polizaVehicular",
                      e.target.value
                    )
                  }
                >
                  <option value="">
                    Seleccionar poliza...
                  </option>

                  {insuranceContracts
                    .filter(
                      (insurance) =>
                        insurance.tipo
                          ?.toLowerCase()
                          .includes("vehicular")
                    )
                    .filter(
                      (insurance) =>
                        !usedVehicularPolicies.includes(
                          insurance.poliza
                        )
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
                  POLIZAS CARGA Y CONTENEDOR
                </label>

                <select
                name="polizaCarga"
                value={form.polizaCarga || ""}
                onChange={(e) =>
                  handleInsuranceSelect(
                    "polizaCarga",
                    e.target.value
                  )
                }
              >
                <option value="">
                  Seleccionar poliza...
                </option>

                {insuranceContracts
                  .filter(
                    (insurance) =>
                      insurance.tipo?.toLowerCase().includes("carga")
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
                 POLIZA ENDOSO
              </label>
              
              <select
                name="polizaEndoso"
                value={form.polizaEndoso || ""}
                onChange={(e) =>
                  handleInsuranceSelect(
                    "polizaEndoso",
                    e.target.value
                  )
                }
              >
                <option value="">
                  Seleccionar poliza...
                </option>

                {insuranceContracts
                  .filter(
                    (insurance) =>
                      insurance.tipo?.toLowerCase().includes("endoso")
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
                  .filter((insurance) => {

                    // SOLO SOAT
                    if (
                      !insurance.poliza?.startsWith(
                        "SOAT-"
                      )
                    ) {
                      return false;
                    }

                    // EN EDICION SI PERMITIR EL MISMO
                    if (
                      isEdit &&
                      form.soat === insurance.poliza
                    ) {
                      return true;
                    }

                    // BLOQUEAR SI YA ESTÁ USADO
                    return !usedSoats.includes(
                      insurance.poliza
                    );
                  })
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
               <div className="grid">
                <div className="col">
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
                    checked={form.documentos.revisionTecnicaCheck}
                    onChange={() =>
                      handleCheckbox("revisionTecnicaCheck")
                    }
                  />
                  REVISIÓN TÉCNICA
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
                  POLIZAS
                </label>
              </div>

              <div className="col">
                <div className="check-item">
                <label className="check-row">
                  <input
                    type="checkbox"
                    checked={form.documentos.tarjetaVehicularCheck}
                    onChange={() =>
                      handleCheckbox("tarjetaVehicularCheck")
                    }
                  />
                  TARJETA DE IDENTIFICACIÓN VEHICULAR
                </label>
                  <div className="label">
                    <input
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
                      placeholder="TARJETA DE I. VEHICULAR"
                    />
                    </div>
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
          {showMessageBox && (
          <div
            className="message-box-overlay"
            onClick={() =>
              setShowMessageBox(false)
            }
          >
            <div
              className="message-box"
              onClick={(e) =>
                e.stopPropagation()
              }
            >
              <h3>
                Datos Duplicados
              </h3>

              <p
                style={{
                  whiteSpace: "pre-line"
                }}
              >
                {messageBoxText}
              </p>

              <button
                className="message-box-btn"
                onClick={() =>
                  setShowMessageBox(false)
                }
              >
                Entendido
              </button>
            </div>
          </div>
        )}

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
