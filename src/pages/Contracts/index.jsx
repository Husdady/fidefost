// Components
import Navigation from "components/features/Navigation";
import PageHeader from "components/features/PageHeader";
import AddButton from "components/features/PageHeader/AddButton";
import ContractsSummary from "modules/contracts/Summary";
import InsuranceContracts from "components/features/InsuranceContracts";
import ContractsGPS from "components/features/ContractsGPS";

// Hooks
import useShowModal from "hooks/useShowModal";
import ContractsSection from "modules/contracts/ContractsSection";

export default function Contracts() {
  const createContractModal = useShowModal();

  return (
    <main className="contracts-page main-container">
      <Navigation />
      
      <aside className="page-content d-flex flex-column row-gap-4">
        <PageHeader
          title="Gestion de Contratos"
          description="Monitoreo y vinculación operativa de recursos."
        >
          <AddButton
            onClick={createContractModal.show}
            title="Crear Contrato de Seguro"
          />
          <AddButton
            onClick={createContractModal.show}
            title="Nuevo Contrato de Unidades"
          />
        </PageHeader>

        <ContractsSummary />
        <ContractsSection />
        
        </aside>
    </main>
  );
}
