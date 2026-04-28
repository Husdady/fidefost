// Components
import InsuranceContracts from "components/features/InsuranceContracts";
import ContractsGPS from "components/features/ContractsGPS";
import ContractsGPSItems from "./ContractsGPSItems";
import GpsIcon from "./icons/gps-icon";
import DateRange from "components/features/DateRange";

export default function ContractsSection() {
  return (
    <section className="contracts-section d-flex align-items-stretch">
      <div className="contracts-section__grid">
        <InsuranceContracts
          title="Contratos de Seguro"
          datefilter={<DateRange />}
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
