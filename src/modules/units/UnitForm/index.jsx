import { createPortal } from "react-dom";
import { useState } from "react";

import saveDocument from "database/saveDocument";
import deleteDocument from "database/deleteDocument";


export default function UnitForm({ show, onHide }) {

  const [unitId] = useState(
  () => Date.now().toString()
);
  const [form, setForm] = useState({
  marca: "",
  placa: "",
  partida: "",
  revisionFecha: "",
  mtc: "",
  polizaFecha: "",
  soatFecha: "",

  documentos: {
    mtcCheck: false,
    recTecnTractorCheck: false,
    recTecnCarretaCheck: false,
    soatCheck: false,
    tarjetaVehicularCheck: false,
    tarjetaVehicularInfo:"",
    permisoMunicipalCheck: false,
  },

  archivos: []
});

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
        module: "units",
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

  if (!show) return null;

  return createPortal(
    <div className="modal" onClick={onHide}>
      <div
        className="modal-content unit-form-modal"
        onClick={(e) => e.stopPropagation()}
      >

        {/* HEADER */}
        <div className="modal-header-custom">
          <div>
            <h2 className="title">
              Registrar Nueva Unidad
            </h2>

            <p className="subtitle">
              Configure los parámetros técnicos y legales.
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
              REVISION TECNICA
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
              POLIZA (FECHA DE VENCIMIENTO)
            </label>

            <input
              type="date"
              value={form.fecha}
              onChange={(e) =>
                setForm({
                  ...form,
                  fecha: e.target.value
                })
              }
            />

            <label className="label">
              SOAT (FECHA DE VENCIMIENTO)
            </label>

            <input
              type="date"
              value={form.soatFecha}
              onChange={(e) =>
                setForm({
                  ...form,
                  soatFecha: e.target.value
                })
              }
            />

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
                checked={form.documentos.tarjetaVehicularCheck}
                onChange={() =>
                  handleCheckbox("tarjetaVehicularCheck")
                }
              />
              TARJETA DE IDENTIFICACION VEHICULAR
            </label>
            <div className="property-card">
                   <input
                   className="small-date"
                    type="text"
                    value={form.documentos.tarjetaVehicularInfo}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        tarjetaVehicularInfo: e.target.value
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
          </div>

        {/* ACTIONS */}
        <div className="actions">
          <button
            className="btn-secondary"
            onClick={onHide}
          >
            Cancelar
          </button>

          <button className="btn-primary">
            Guardar Unidad
          </button>
        </div>

      </div>
    </div>,
    document.body
  );
}
