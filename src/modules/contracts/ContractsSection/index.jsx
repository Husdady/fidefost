// Components
import useGpsContractsStore from "context/contracts/gpsContractsStore";
import { useState } from "react";

import InsuranceContracts from "components/features/InsuranceContracts";
import ContractsGPS from "components/features/ContractsGPS";
import ContractsGPSItems from "./ContractsGPSItems";
import GpsIcon from "./icons/gps-icon";
import GpsContractForm from "../GpsContractForm";

import useShowModal from "hooks/useShowModal";

export default function ContractsSection() {
  const removeGpsContract =
  useGpsContractsStore(
    (state) => state.removeGpsContract
  );
  const gpsContracts = useGpsContractsStore(
  (state) => state.gpsContracts
  );
  const [editingGps, setEditingGps] =
  useState(null);

  const addGpsContract = useGpsContractsStore(
    (state) => state.addGpsContract
  );

  const updateGpsContract =
  useGpsContractsStore(
    (state) => state.updateGpsContract
  );

  const gpsContractModal = useShowModal();
  return (
    <>
    <section className="contracts-section d-flex align-items-stretch">
      <div className="contracts-section__grid">
        <InsuranceContracts
          title="Contratos de Seguro"
        ></InsuranceContracts>
      </div>

      <div className="contracts-section__grid">
        <ContractsGPS
          icon={<GpsIcon />}
          title="Contratos GPS  "
          summarygps={<ContractsGPSItems 
                items={gpsContracts} 
                onEdit={(gps) => {
                  setEditingGps(gps); 
                  gpsContractModal.show();
                }}
                onDelete={(id) =>
                  removeGpsContract(id)
                }
                />
              }
          action={
            <button 
                className="contracts-gps__button"
                onClick={gpsContractModal.show}>
              + Contratar
            </button>
          }
        ></ContractsGPS>
      </div>
    </section>
     <GpsContractForm
        show={gpsContractModal.isShowing}
        onHide={() => {
          setEditingGps(null);
          gpsContractModal.hide();
        }}
        onUpdate={(updatedContract) => {
          updateGpsContract(updatedContract);
          setEditingGps(null);
          gpsContractModal.hide();
        }}
        editingGps={editingGps}
        onSave={(newContract) => {
          addGpsContract(newContract);
          setEditingGps(null);
          gpsContractModal.hide();
        }}
      />
  </>
  );
 
}
