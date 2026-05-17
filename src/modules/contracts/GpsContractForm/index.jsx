import { useState, useEffect } from "react";


export default function GpsContractForm({
  show,
  onHide,
  onSave,
  onUpdate,
  editingGps,
}) {
  

  const [form, setForm] = useState({
  id: "",
  provider: "",
  gpsLink: "",
  installationDate: "",
  endDate: "",
});

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
    <div className="gps-modal">
      <div className="gps-modal__content">

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

        <div className="gps-modal__actions">
          <button onClick={onHide}>
            Cancelar
          </button>

          <button
            disabled={!isFormValid}
            onClick={() => {
              if (editingGps) {

                onUpdate(form);

              } else {

                onSave({
                  ...form,
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