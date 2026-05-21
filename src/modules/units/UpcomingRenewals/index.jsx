import { useState } from "react";
import { useGetInsurance } from "context/contracts/useInsurance";
import { useGetUnits } from "context/units/useUnits";

import InsuranceContractForm from "modules/contracts/InsuranceContractForm";
import InsuranceIcon from "./icons/insurance-icon";

export default function UpcomingRenewals() {
  
  const [search, setSearch] = useState("");
  const insuranceContracts = useGetInsurance();
  const units = useGetUnits();

  const [editModal, setEditModal] =
  useState(false);

  const [selectedInsurance, setSelectedInsurance] =
  useState(null);

  const renovaciones = insuranceContracts;

  const filteredRenovaciones =
  renovaciones.filter((item) =>
    (
      item.poliza +
      " " +
      item.tipo
    )
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <>
    
    <article className="upcoming-renewals">

      <div className="upcoming-renewals__header">

        <h2 className="upcoming-renewals__title">
          Próximas Renovaciones
        </h2>

      </div>
      <div className="renewals-search">
        <input
          type="text"
          placeholder="Buscar renovación..."
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

        const millisecondsPerDay =
          1000 * 60 * 60 * 24;

        // FECHA ACTUAL
        const today = new Date();

        const todayString =
          `${today.getFullYear()}-${
            String(today.getMonth() + 1).padStart(2, "0")
          }-${
            String(today.getDate()).padStart(2, "0")
          }`;

        // TIMESTAMPS LIMPIOS
        const currentDate =
          new Date(todayString).getTime();

        const endDate =
          new Date(insurance.fechaFin).getTime();

        // DIFERENCIA REAL
        const diffDays =
          Math.trunc(
            (endDate - currentDate) /
            millisecondsPerDay
          );

        let status = "ACTIVO";
        let statusClass = "renewal-success";

        if (diffDays < 0) {

          status = "EXPIRADO";
          statusClass = "renewal-danger";

        } else if (diffDays <= 59) {

          status = "PROX. EXPIRAR";
          statusClass = "renewal-warning";
        }
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

                  {/* PLACA + FECHA */}
                  <p>
                    Unidad {linkedUnit?.placa || "Sin unidad"}
                    {" • "}
                    Vence el {insurance.fechaFin}
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