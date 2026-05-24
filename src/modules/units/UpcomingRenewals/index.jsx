import { useState } from "react";
import { useGetInsurance } from "context/contracts/useInsurance";
import { useGetUnits } from "context/units/useUnits";

import InsuranceContractForm from "modules/contracts/InsuranceContractForm";
import InsuranceIcon from "./icons/insurance-icon";

export default function UpcomingRenewals() {
  
  const [filterStatus, setFilterStatus] =
  useState("TODOS");
  const [search, setSearch] = useState("");
  const insuranceContracts = useGetInsurance();
  const units = useGetUnits();

  const [editModal, setEditModal] =
  useState(false);

  const [selectedInsurance, setSelectedInsurance] =
  useState(null);

  const renovaciones = insuranceContracts;
  
  const getInsuranceStatus = (fechaFin) => {

  const millisecondsPerDay =
    1000 * 60 * 60 * 24;

  const today = new Date();

  const todayString =
    `${today.getFullYear()}-${
      String(today.getMonth() + 1).padStart(2, "0")
    }-${
      String(today.getDate()).padStart(2, "0")
    }`;

  const currentDate =
    new Date(todayString).getTime();

  const endDate =
    new Date(fechaFin).getTime();

  const diffDays =
    Math.trunc(
      (endDate - currentDate) /
      millisecondsPerDay
    );

  if (diffDays < 0) {
    return {
      status: "EXPIRADO",
      statusClass: "renewal-danger",
      priority: 1
    };
  }

  if (diffDays <= 60) {
    return {
      status: "PROX. EXPIRAR",
      statusClass: "renewal-warning",
      priority: 2
    };
  }

  return {
    status: "ACTIVO",
    statusClass: "renewal-success",
    priority: 3
  };
};

  const filteredRenovaciones =
  renovaciones
    .filter((item) =>
      (
        item.poliza +
        " " +
        item.tipo
      )
        .toLowerCase()
        .includes(search.toLowerCase())
    )

    .filter((item) => {

      const { status } =
        getInsuranceStatus(
          item.fechaFin
        );

      return (
        filterStatus === "TODOS" ||
        filterStatus === status
      );
    })

    .sort((a, b) => {

      const statusA =
        getInsuranceStatus(
          a.fechaFin
        );

      const statusB =
        getInsuranceStatus(
          b.fechaFin
        );

      // =====================
      // SOLO EN "TODOS"
      // =====================

      if (
        filterStatus === "TODOS"
      ) {

        // ORDEN POR ESTADO
        if (
          statusA.priority !==
          statusB.priority
        ) {
          return (
            statusA.priority -
            statusB.priority
          );
        }
      }

      // =====================
      // ORDEN POR FECHA
      // =====================

      return (
        new Date(a.fechaFin) -
        new Date(b.fechaFin)
      );
    });
    
    //format date
    const formatDate = (dateString) => {

      if (!dateString) {
        return "-";
      }

      const [year, month, day] =
        dateString.split("-");

      return `${day}/${month}/${year}`;
    };

  return (
    <>
    
    <article className="upcoming-renewals">

      <div className="upcoming-renewals__header">

        <h2 className="upcoming-renewals__title">
          Estados y Renovaciones
          <span>(POLIZAS/SOAT)</span>
        </h2>

        <div className="renewals-filters">

            <select
              value={filterStatus}
              onChange={(e) =>
                setFilterStatus(e.target.value)
              }
            >
              <option value="TODOS">
                Todos
              </option>

              <option value="ACTIVO">
                Activos
              </option>

              <option value="PROX. EXPIRAR">
                Prox. Expirar
              </option>

              <option value="EXPIRADO">
                Expirados
              </option>

            </select>

          </div>
      </div>
      <div className="renewals-search">
        <input
          type="text"
          placeholder="Buscar N° Poliza o SOAT"
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />
      </div>
      <div className="renewal-cards-wrapper">

      <div className="renewal-cards">

        {filteredRenovaciones.map((insurance) => {

          // BUSCAR UNIDAD RELACIONADA
          const linkedUnit = units.find((unit) => {

            // SI ES SOAT
            if (insurance.tipo === "SOAT") {
              return unit.soat === insurance.poliza;
            }

            // SI ES POLIZA
            return unit.poliza === insurance.poliza;
          });
 
        const {
                status,
                statusClass
              } = getInsuranceStatus(
                insurance.fechaFin
              );
        
          return (
            <div
              key={insurance._id}
              className={`renewal-card ${statusClass}`}
            >

              <div className="renewal-card-left">

                <div className="renewal-icon">
                  <InsuranceIcon/>
                </div>

                <div className="renewal-info">

                  {/* TIPO */}
                  <h4>
                    {insurance.tipo}
                  </h4>

                  <p className="renewal-policy">
                    {insurance.poliza}
                  </p>

                  {/* PLACA + FECHA */}
                  <p>
                    Unidad {linkedUnit?.placa || "Sin unidad"}
                    {" • "}
                    Vence el {formatDate(insurance.fechaFin)}
                  </p>

                  <span className="renewal-status">
                    {status}
                  </span>

                </div>

              </div>

              {(
                status === "PROX. EXPIRAR" ||
                status === "EXPIRADO"
              ) && (
                <button
                  className="renewal-card-button"
                  onClick={() => {

                    setSelectedInsurance(insurance);

                    setEditModal(true);
                  }}
                >
                  Gestionar
                </button>
              )}

            </div>
          );
        })}

      </div>
      </div>

    </article>

            <InsuranceContractForm
              show={editModal}
              onHide={() => {

                setEditModal(false);

                setSelectedInsurance(null);
              }}
              initialData={selectedInsurance}
              isEdit={true}
            />
        </>
  );


}