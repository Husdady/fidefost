// Components
import Navigation from "components/features/Navigation";
import PageHeader from "components/features/PageHeader";
import AddButton from "components/features/PageHeader/AddButton";
import ContractsSummary from "modules/contracts/Summary";

// Hooks
import useShowModal from "hooks/useShowModal";

export default function Contracts() {
  const createOperatorModal = useShowModal();

  return (
    <main className="contracts-page main-container">
      <Navigation />
      
      <aside className="page-content d-flex flex-column row-gap-4">
        <PageHeader
          title="Gestion de Contratos"
          description="Monitoreo y vinculación operativa de recursos."
        >
          <AddButton
            onClick={createOperatorModal.show}
            title="Crear Contrato de Seguro"
          />
          <AddButton
            onClick={createOperatorModal.show}
            title="Nuevo Contrato de Unidades"
          />
        </PageHeader>

        <ContractsSummary />
        </aside>
    </main>
  );
}
