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
  unit: "",
  installationDate: "",
  endDate: "",
});

 useEffect(() => {

    if (editingGps) {

      setForm(editingGps);

    }

  }, [editingGps]);

  
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
            <label>UNIDAD</label>

            <select
            value={form.unit}
            onChange={(e) =>
              setForm({
                ...form,
                unit: e.target.value,
              })
            }>
              <option value="">
                Seleccionar unidad
              </option>

              <option value="unidad-1">
                Unidad 001
              </option>

              <option value="unidad-2">
                Unidad 002
              </option>

              <option value="unidad-3">
                Unidad 003
              </option>
            </select>
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
                unit: "",
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