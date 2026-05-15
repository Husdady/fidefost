import { useGetUnits } from "context/units/useUnits";
import { useState } from "react";
import UnitForm from "../UnitForm";
import { useDeleteUnit } from "context/units/useUnits";
import deleteDocument from "database/deleteDocument";


//icons
import EditIcon from "./icons/edit-icon";
import DeleteIcon from "./icons/delete-icon";

export default function UnitsTable() {

const deleteUnit = useDeleteUnit();

const [editModal, setEditModal] =
  useState(false);

const [selectedUnit, setSelectedUnit] =
  useState(null);

  const units = useGetUnits();

  return (
    <div className="units-table-container">

      {/* HEADER */}
      <div className="units-table-header">

        <div>
          <h3>Listado de Unidades</h3>
        </div>

        <div className="units-table-filters">

          <input type="date" />

          <input type="date" />

          <button className="export-btn">
            Exportar Data
          </button>

        </div>

      </div>

      {/* TABLE */}
      <table className="units-table">

        <thead>
          <tr>
            <th>UNIDAD / PLACA</th>
            <th>MTC / PROPIEDAD</th>
            <th>REV. TÉCNICA</th>
            <th>SOAT / PÓLIZA</th>
            <th>ACCIONES</th>
          </tr>
        </thead>

        <tbody>

          {units.map((unit) => (
            <tr key={unit._id}>

              <td>
                <div className="unit-info">

                  <div className="unit-icon">
                    🚚
                  </div>
                  

                  <div>
                    <strong>{unit.placa}</strong>
                    <p>{unit.marca}</p>
                  </div>

                </div>
              </td>

              <td>
                <strong>
                  MTC: {unit.mtc}
                </strong>
                <p>
                  T.P: {unit.tarjetaVehicularInfo}
                </p>
              </td>

              <td>
                <span className="badge-success">
                  {unit.revisionFecha}
                </span>
              </td>

              <td>
                <strong className="soat-ok">
                  {unit.soat}
                </strong>

                <p>{unit.poliza}</p>
              </td>

              <td>
                <div className="contracts-gps-item__column">
                  <span className="contracts-gps-item__label">
                    <button
                      onClick={() => {
                        setSelectedUnit(unit);
                        setEditModal(true);
                      }}
                    >
                      <EditIcon />
                    </button>
                  </span>

                  <span className="contracts-gps-item__label">
                    <button
                      onClick={async () => {

                        // ELIMINAR ARCHIVOS INDEXEDDB
                        for (const file of unit.archivos || []) {

                          if (!file.id) {
                            continue;
                          }

                          await deleteDocument(file.id);
                        }

                        // ELIMINAR UNIDAD ZUSTAND
                        deleteUnit(unit._id);
                      }}
                    >
                      <DeleteIcon />
                    </button>
                  </span>
                </div>
              </td>

            </tr>
          ))}

        </tbody>

      </table>

      <UnitForm
        show={editModal}
        onHide={() => {

          setEditModal(false);

          setSelectedUnit(null);
        }}
        initialData={selectedUnit}
        isEdit={true}
      />

      <p className="units-results">
        Mostrando 1-{units.length} unidades
      </p>

    </div>
  );
}