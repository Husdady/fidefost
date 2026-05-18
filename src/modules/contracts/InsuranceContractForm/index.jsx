import saveDocument from "database/saveDocument";
import getDocumentsByRelation from "database/getDocumentsByRelation";
import deleteDocument from "database/deleteDocument";
import { createPortal } from "react-dom";
import { useState, useEffect } from "react";

import { useUpdateInsurance } from "context/contracts/useInsurance";
import { useGetInsurance } from "context/contracts/useInsurance";

export default function InsuranceContractForm({
  show,
  onHide,
  onSave,
  initialData = null,
  isEdit = false
}) {

  
  const [insuranceId] = useState(
  () => initialData?._id || crypto.randomUUID()
);

  const [files, setFiles] = useState([]);

  const [originalFiles, setOriginalFiles] = useState([]);

  const [deletedFiles, setDeletedFiles] = useState([]);

  const [showDuplicateMessage, setShowDuplicateMessage] =
  useState(false);

  const updateInsurance = useUpdateInsurance();

  const insuranceContracts = useGetInsurance();
  
  const [form, setForm] = useState(
    

  initialData || {

    proveedor: "",
    poliza: "",
    tipo: "",
    fechaInicio: "",
    fechaFin: "",
    archivos: []
  }
);

  useEffect(() => {

  if (initialData) {

    setForm({
      ...initialData,

      // quitar prefijo visualmente
      poliza:
        initialData.poliza
          ?.replace("SOAT-", "")
          ?.replace("POLIZA-", "")
    });
  }

  const loadFiles = async () => {

    const savedFiles =
      await getDocumentsByRelation(
        "insurance",
        initialData?._id || insuranceId
      );

    setFiles(savedFiles);

    setOriginalFiles(savedFiles);
  };

  loadFiles();

}, [initialData, insuranceId]);


if (!show) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {

    const fullPolicy =
  `${policyPrefix}${form.poliza}`;

const alreadyExists =
  insuranceContracts.some((insurance) => {

    // permitir editar el mismo
    if (
      isEdit &&
      insurance._id === initialData?._id
    ) {
      return false;
    }

    return (
      insurance.poliza
        ?.toLowerCase()
        .trim() ===
      fullPolicy
        .toLowerCase()
        .trim()
    );
  });

if (alreadyExists) {

  setShowDuplicateMessage(true);

  setTimeout(() => {
    setShowDuplicateMessage(false);
  }, 3000);

  return;
}

  // eliminar definitivamente
  // solo al actualizar
  if (isEdit) {

    for (const fileId of deletedFiles) {

      await deleteDocument(fileId);
    }
  }

  const storedFiles = [];

  for (const file of files) {

    // si ya existe en indexeddb
    if (file.id) {

      storedFiles.push(file);

      continue;
    }

    // guardar nuevos archivos
    const saved = await saveDocument({
      file,
      module: "insurance",
      relatedId: insuranceId,
    });

    storedFiles.push(saved);
  }

  const newInsurance = {

    _id: insuranceId,

    ...form,

    poliza:
      `${policyPrefix}${form.poliza}`,

    archivos: storedFiles,
  };

  // EDITAR
  if (isEdit) {

    updateInsurance(
      initialData._id,
      newInsurance
    );

    onHide();

    return;
  }

  // CREAR
  onSave(newInsurance);
};

const isFormValid =

  // CAMPOS
  form.proveedor &&
  form.tipo &&
  form.poliza &&
  form.fechaInicio &&
  form.fechaFin &&

  // ARCHIVOS
  files.length > 0;

  const policyPrefix =
  form.tipo === "SOAT"
    ? "SOAT-"
    : "POLIZA-";

  const handleClose = () => {

    // restaurar archivos originales
    // si cancela edición
    if (isEdit) {

      setFiles(originalFiles);

      setDeletedFiles([]);
    }

    onHide();
  };


  return createPortal(
    <div className="modal" onClick={handleClose}>
      <div
        className="modal-content insurance-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="insurance-form-title">
          {isEdit
            ? "Editar Seguro"
            : "Registrar Seguro"}
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

              <option>Polizas de Carga y Contenedor</option>
              <option>Endosos</option>
              <option>Poliza Vehicular</option>
              <option>SOAT</option>
            </select>

          </div>

        </div>

                {/* POLIZA */}
        <div className="policy-section">

          <label className="label">
            {form.tipo === "SOAT"
              ? "NUMERO"
              : "NUMERO DE POLIZA"}
          </label>

          <div className="policy-row">

            <span className="policy-label">
              {policyPrefix}
            </span>

            <input
              className="policy-field"
              type="text"
              value={form.poliza}
              onChange={(e) =>
                setForm({
                  ...form,
                  poliza: e.target.value
                })
              }
              placeholder="INGRESAR"
            />

          </div>

        </div>

        {/* FECHAS */}
        <div className="insurance-dates-grid">

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

              const uploadedFiles =
                Array.from(e.target.files);

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

                {files.map((file) => (
                  <div
                    key={file.id || file.name}
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

                      const fileToDelete = files[index];

                      // guardar ids eliminados temporalmente
                      if (fileToDelete.id) {

                        setDeletedFiles((prev) => [
                          ...prev,
                          fileToDelete.id
                        ]);
                      }

                      // solo quitar del form visualmente
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

        {showDuplicateMessage && (
          <div className="duplicate-message">
              {form.tipo === "SOAT"
                ? "INGRESAR OTRO, Este SOAT ya se encuentra registrado"
                : "INGRESAR OTRO, Esta póliza ya se encuentra registrada"}
          </div>
        )}

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
            disabled={!isFormValid}
          >
            {isEdit
              ? "Actualizar Seguro"
              : "Guardar Seguro"}
          </button>

        </div>

      </div>
    </div>,
    document.body
  );
}