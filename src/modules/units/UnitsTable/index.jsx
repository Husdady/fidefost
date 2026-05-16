import { useGetUnits } from "context/units/useUnits";
import { useState } from "react";
import UnitForm from "../UnitForm";
import { useDeleteUnit } from "context/units/useUnits";
import deleteDocument from "database/deleteDocument";

//export 
import exportUnitsExcel from "utils/exportUnitsExcel";
import exportUnitsZip from "utils/exportUnitsZip";

//icons
import EditIcon from "./icons/edit-icon";
import DeleteIcon from "./icons/delete-icon";
import ExportIcon from "./icons/export-icon";

export default function UnitsTable() {

const [currentPage, setCurrentPage] =
  useState(0);

const itemsPerPage = 10;

  const startIndex =
  currentPage * itemsPerPage;

const endIndex =
  startIndex + itemsPerPage;

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

          <button 
               onClick={() => exportUnitsExcel(units)}
               className="export-btn"
          >
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
                <div>
                  <span>
                    <button
                      onClick={() => {
                        setSelectedUnit(unit);
                        setEditModal(true);
                      }}
                    >
                      <EditIcon />
                    </button>
                  </span>

                  <span>
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

                  <span>
                    <button
                    onClick={() =>
                      exportUnitsZip(unit)
                    }
                    >
                      <ExportIcon />
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
         Mostrando {
          units.length === 0
            ? 0
            : startIndex + 1
        }
        -
        {
          Math.min(
            endIndex,
            units.length
          )
        }
        unidades
      </p>

    </div>
  );
}