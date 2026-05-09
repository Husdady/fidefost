// Components
import InsuranceContracts from "components/features/InsuranceContracts";
import ContractsGPS from "components/features/ContractsGPS";
import ContractsGPSItems from "./ContractsGPSItems";
import GpsIcon from "./icons/gps-icon";
import GpsContractForm from "../GpsContractForm";

import useShowModal from "hooks/useShowModal";

export default function ContractsSection() {
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
          title="Contratos GPS"
          summarygps={<ContractsGPSItems />}
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
        onHide={gpsContractModal.hide}
      />
  </>
  );
 
}
