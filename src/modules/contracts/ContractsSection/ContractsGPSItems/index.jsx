import { useState } from "react";

import EditIcon from "./Icons/edit-icon";
import DeleteIcon from "./Icons/delete-icon";


export default function ContractsGPSItems({
  items = [], onEdit, onDelete,
}) {
  const [search, setSearch] = useState("");
  const filteredItems = items.filter(
  (item) =>
    item.id
      .toLowerCase()
      .includes(search.toLowerCase())
);

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
  return (
    <div className="contracts-gps__list">
      <div className="contracts-gps__search">
      <input
        type="text"
        placeholder="Buscar por ID GPS..."
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
      />
    </div>

      {filteredItems.map((item, index) => {

        const status = getGpsStatus(
          item.endDate
        );

        return (
        <div
          key={index}
          className="contracts-gps-item"
        >
          <div className="contracts-gps-item__header">
            <span className="contracts-gps-item__id">
              ID: {item.id}
            </span>

            <span className="contracts-gps-item__status">
              <span
                className="contracts-gps-item__status"
                style={{
                  color: status.color,
                }}
              >
                ● {status.text}
              </span>
            </span>
          </div>

          <div className="contracts-gps-item__body">

            <div className="contracts-gps-item__column">
              <span className="contracts-gps-item__label">
                INICIO CONTRATO
              </span>

              <span className="contracts-gps-item__date">
                {item.installationDate}
              </span>
            </div>

            <div className="contracts-gps-item__column">
              <span className="contracts-gps-item__label">
                FIN CONTRATO
              </span>

              <span className="contracts-gps-item__date">
                {item.endDate}
              </span>
            </div>

            <div className="contracts-gps-item__column">
              <span className="contracts-gps-item__label">
                <button
                  onClick={() => onEdit(item)}
                >
                  <EditIcon />
                </button>
              </span>
              <span className="contracts-gps-item__label">
                <button
                  onClick={() =>
                    onDelete(item.id)
                  }
                >
                  <DeleteIcon/>
                </button>
              </span>
            </div>

          </div>
        </div>
      );
    })}

    </div>
  );
}