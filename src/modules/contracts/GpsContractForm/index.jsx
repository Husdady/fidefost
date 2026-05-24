import { useState, useEffect } from "react";
import useGpsContractsStore from "context/contracts/gpsContractsStore";


export default function GpsContractForm({
  show,
  onHide,
  onSave,
  onUpdate,
  editingGps,
}) {

  const gpsContracts = useGpsContractsStore(
  (state) => state.gpsContracts
);
  
  const [form, setForm] = useState({
  
  id: "",
  provider: "",
  gpsLink: "",
  installationDate: "",
  endDate: "",
});

const [showDuplicateMessage, setShowDuplicateMessage] =
  useState(false);

 useEffect(() => {

    if (editingGps) {

      setForm(editingGps);

    }

  }, [editingGps]);

const isFormValid =

  // CAMPOS
  form.id &&
  form.provider &&
  form.gpsLink &&
  form.installationDate &&
  form.endDate;

  if (!show) return null;

  return (
    <div className="gps-modal"
          onClick={onHide}>
      <div className="gps-modal__content"
           onClick={(e) => e.stopPropagation()}>

        <h2 className="gps-modal__title">
          {editingGps
            ? "Editar Contrato GPS"
            : "Nuevo Contrato GPS"}
        </h2>

        <div className="gps-modal__form">

          <div className="gps-modal__field">
            <label>ID</label>

            <input
              type="text"
              placeholder="GPS-AX-882"
              value={form.id}
              onChange={(e) =>
                setForm({
                  ...form,
                  id: e.target.value,
                })
              }
            />
          </div>
          <div className="gps-modal__field">
            <label>PROVEEDOR</label>

            <input
              type="text"
              placeholder="Ej: Hunter, Tracklink..."
              value={form.provider}
              onChange={(e) =>
                setForm({
                  ...form,
                  provider: e.target.value,
                })
              }
            />
          </div>
          <div className="gps-modal__field">
            <label>LINK SISTEMA GPS</label>

            <input
              type="text"
              placeholder="https://..."
              value={form.gpsLink}
              onChange={(e) =>
                setForm({
                  ...form,
                  gpsLink: e.target.value,
                })
              }
            />
          </div>

          <div className="gps-modal__field">
            <label>Fecha inicio contrato</label>

            <input
              type="date"
              value={form.installationDate}
              onChange={(e) =>
                setForm({
                  ...form,
                  installationDate: e.target.value,
                })
              }
            />
          </div>

          <div className="gps-modal__field">
            <label>Fecha fin contrato</label>

            <input
              type="date"
              value={form.endDate}
              onChange={(e) =>
                setForm({
                  ...form,
                  endDate: e.target.value,
                })
              }
            />
          </div>

        </div>

        {showDuplicateMessage && (
          <div className="duplicate-message">
            INGRESAR OTRO, Este GPS ya se encuentra registrado
          </div>
        )}

        <div className="gps-modal__actions">
          <button 
            className="btn-secondary"
            onClick={onHide}>
            Cancelar
          </button>

          <button
            className="btn-primary"
            disabled={!isFormValid}
            onClick={() => {
              const alreadyExists =
              gpsContracts.some((gps) => {

                // IGNORAR EL MISMO REGISTRO
                if (
                  editingGps &&
                  gps._id === editingGps._id
                ) {
                  return false;
                }

                return (
                  gps.id
                    ?.toLowerCase()
                    .trim() ===
                  form.id
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
              if (editingGps) {

                onUpdate(form);

              } else {

                onSave({
                  ...form,
                  _id: crypto.randomUUID(),
                  status: "ONLINE",
                });

              }

              setForm({
                id: "",
                provider: "",
                gpsLink: "",
                installationDate: "",
                endDate: "",
              });

              onHide();
            }}
          >
            Guardar
          </button>
        </div>

      </div>
    </div>
  );
}