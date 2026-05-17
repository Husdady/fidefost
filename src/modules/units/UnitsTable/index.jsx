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

const deleteUnit = useDeleteUnit();

const [editModal, setEditModal] =
  useState(false);

const [selectedUnit, setSelectedUnit] =
  useState(null);

const [search, setSearch] =
  useState("");

const units = useGetUnits();

const query =
    search.toLowerCase();

const filteredUnits = units.filter((unit) => {

  return (
    unit.placa
      ?.toLowerCase()
      .includes(query) ||

    unit.marca
      ?.toLowerCase()
      .includes(query) ||

    unit.soat
      ?.toLowerCase()
      .includes(query) ||

    unit.poliza
      ?.toLowerCase()
      .includes(query) ||

    unit.mtc
      ?.toLowerCase()
      .includes(query)
  );
});

  return (
    <div className="units-table-container">

      {/* HEADER */}
      <div className="units-table-header">

        <div>
          <h3>Listado de Unidades</h3>
        </div>

        <div className="units-table-filters">

          <input
            type="text"
            placeholder="Buscar placa, SOAT, póliza..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

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

          {filteredUnits.map((unit) => (
            
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
                    <button
                      onClick={() => {
                        setSelectedUnit(unit);
                        setEditModal(true);
                      }}
                    >
                      <EditIcon />
                    </button>
                  
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
                  

                  
                    <button
                    onClick={() =>
                      exportUnitsZip(unit)
                    }
                    >
                      <ExportIcon />
                    </button>
                  
                  
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
          filteredUnits.length
        } resultados
      </p>

    </div>
  );
}