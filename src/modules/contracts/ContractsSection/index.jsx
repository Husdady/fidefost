// Components
import InsuranceContracts from "components/features/InsuranceContracts";
import ContractsGPS from "components/features/ContractsGPS";
import ContractsGPSItems from "./ContractsGPSItems";
import GpsIcon from "./icons/gps-icon";

export default function ContractsSection() {
  return (
    <section className="contracts-section d-flex align-items-stretch">
      <div className="contracts-section__grid">
        <InsuranceContracts
          title="Contratos de Seguro"
          description="Aqui va el filtro de calendario"
        ></InsuranceContracts>
      </div>

      <div className="contracts-section__grid">
        <ContractsGPS
          icon={<GpsIcon />}
          title="Contratos GPS"
          summarygps={<ContractsGPSItems />}
        ></ContractsGPS>
      </div>
    </section>
  );
}
