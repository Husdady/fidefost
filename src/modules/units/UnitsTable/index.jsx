import { useGetUnits } from "context/units/useUnits";
import { useState } from "react";
import UnitForm from "../UnitForm";
import { useDeleteUnit } from "context/units/useUnits";
import { useGetInsurance } from "context/contracts/useInsurance";
import deleteDocument from "database/deleteDocument";
import getRevisionStatus from "utils/getRevisionStatus";

//export 
import exportUnitsExcel from "utils/exportUnitsExcel";
import exportUnitsZip from "utils/exportUnitsZip";

//icons
import EditIcon from "./icons/edit-icon";
import DeleteIcon from "./icons/delete-icon";
import ExportIcon from "./icons/export-icon";
import UnitIcon from "./icons/unit-icon";
import InsuranceContracts from "components/features/InsuranceContracts";
export default function UnitsTable() {

const deleteUnit = useDeleteUnit();

const [editModal, setEditModal] =
  useState(false);

const [selectedUnit, setSelectedUnit] =
  useState(null);

const [search, setSearch] =
  useState("");

const units = useGetUnits();

const insuranceContracts =
  useGetInsurance();
  
const query =
    search
    .toLowerCase()
    .trim();

const filteredUnits = units.filter((unit) => {

  return (
    
    unit.placaTractor
      ?.toLowerCase()
      .includes(query) ||
    
    unit.placaCarreta
      ?.toLowerCase()
      .includes(query) ||

    unit.marca
      ?.toLowerCase()
      .includes(query) ||

    (unit.soat
      ?.split("-")[1] || "")
      .toLowerCase()
      .includes(query) ||

    (unit.polizaVehicular
      ?.split("-")[1] || "")
      .toLowerCase()
      .includes(query) ||
    
    (unit.polizaCarga
      ?.split("-")[1] || "")
      .toLowerCase()
      .includes(query) ||
    
    (unit.polizaEndoso
      ?.split("-")[1] || "")
      .toLowerCase()
      .includes(query) ||
    
    unit.mtc
      ?.toLowerCase()
      .includes(query) ||

    unit.tarjetaVehicularInfo
      ?.toLowerCase()
      .includes(query)
  );
});

const formatDate = (dateString) => {

      if (!dateString) {
        return "-";
      }

      const [year, month, day] =
        dateString.split("-");

      return `${day}/${month}/${year}`;
    };

  return (
    <div className="units-table-container">

      {/* HEADER */}
      <div className="units-table-header">

        <div>
          <h3>Listado de Unidades</h3>
        </div>

        <div>
          <button 
               onClick={() => exportUnitsExcel(units)}
               className="export-btn"
          >
            Exportar Data
          </button>
        </div>
        
      </div>
        <div className="units-table-search">
          <input
            type="text"
            placeholder="Buscar Placa de Tractor o Carreta,  Marca,  SOAT,  Pólizas,  MTC,  T. Identificación Vehicular"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />
        </div>

      {/* TABLE */}
      <div className="units-table-wrapper">

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
                    <UnitIcon/>
                  </div>
                  

                  <div className="unit-plate">
                    <strong>PT: {unit.placaTractor}</strong>
                    <strong>PC: {unit.placaCarreta}</strong>
                    <p>{unit.marca}</p>
                  </div>

                </div>
              </td>

              <td className="col-tarjetas">
                <strong>
                  MTC: {unit.mtc}
                </strong>
                <p>
                  T.P: {unit.tarjetaVehicularInfo}
                </p>
              </td>

              <td>
               <div className="unit-revision">
                <span
                  className={
                    getRevisionStatus(
                      unit.revisionFechaPT
                    )
                  }
                >
                  PT:{" "}{formatDate(unit.revisionFechaPT)}
                </span>
                <span
                  className={
                    getRevisionStatus(
                      unit.revisionFechaPC
                    )
                  }
                >
                  PC:{" "}{formatDate(unit.revisionFechaPC)}
                </span>
               </div>
              </td>

              <td className="col-seguros">
                <strong className="soat">
                  SOAT:{" "}
                  {unit.soat?.split("-")[1]|| "-"}
                </strong>

                <p>
                  P.V:{" "}
                  {unit.polizaVehicular?.split("-")[1] || "-"}
                </p>

                <p>
                  P.C.C:{" "}
                  {unit.polizaCarga?.split("-")[1] || "-"}
                </p>

                <p>
                  P.E:{" "}
                  {unit.polizaEndoso?.split("-")[1] || "-"}
                </p>
              </td>

              <td>
                <div className="unit-actions">
                    <button className="btn-actions"
                      onClick={() => {
                        setSelectedUnit(unit);
                        setEditModal(true);
                      }}
                    >
                      <EditIcon />
                    </button>
                  
                    <button className="btn-actions"
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
                  

                  
                    <button className="btn-actions"
                    onClick={() =>
                      exportUnitsZip(
                        unit,
                        insuranceContracts
                      )
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
      </div>

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