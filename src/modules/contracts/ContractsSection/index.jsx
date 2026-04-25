// Components
import InsuranceContracts from "components/features/InsuranceContracts";
import ContractsGPS from "components/features/ContractsGPS";
import ContractsGPSItems from "./ContractsGPSItems";




export default function ContractsSection() {
  return (
    <section className="contracts-section d-flex">
      <div className="contracts-section__grid">
        <InsuranceContracts
          title="Contratos de Seguro"
          description="Aqui va el filtro de calendario"     
        >
        </InsuranceContracts>
      </div>
      
      <div className="contracts-section__grid">
        <ContractsGPS
          title="Contratos GPS"
          summarygps={<ContractsGPSItems />}
          >
        </ContractsGPS>

      </div>
    </section>
  );
}