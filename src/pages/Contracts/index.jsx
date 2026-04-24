// Components
import Navigation from "components/features/Navigation";
import PageHeader from "components/features/PageHeader";
import AddButton from "components/features/PageHeader/AddButton";
import ContractsSummary from "modules/contracts/Summary";
import InsuranceContractsSection from "components/features/InsuranceContractsSection";

// Hooks
import useShowModal from "hooks/useShowModal";

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
        <InsuranceContractsSection
          title="Contratos de Seguro"
          description="Aqui va el filtro de calendario"     
        >
          
        </InsuranceContractsSection>
        
        </aside>
    </main>
  );
}
