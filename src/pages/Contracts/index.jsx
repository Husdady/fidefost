// Components
import Navigation from "components/features/Navigation";
import PageHeader from "components/features/PageHeader";
import ContractsSummary from "modules/contracts/Summary";
import AddButton from "components/features/PageHeader/AddButton";
import RapidUnitAudit from "components/features/RapidUnitAudit";
import ContractsSection from "modules/contracts/ContractsSection";
import DriverContractForm from "modules/contracts/DriverContractForm";

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
          <div className="d-flex align-items-center column-gap-3">
            <AddButton
              onClick={createContractModal.show}
              title="Crear Contrato de Seguro"
            />

            <AddButton
              onClick={createContractModal.show}
              title="Nuevo Contrato de Unidades"
            />
          </div>
        </PageHeader>

        <ContractsSummary />
        <ContractsSection />
        <RapidUnitAudit title="Auditoría Rapida de Unidades">
          <AddButton onClick={createContractModal.show} title="EXPORTAR" />
        </RapidUnitAudit>
      </aside>

      {createContractModal.isShowing && (
        <DriverContractForm
          isShowing
          title="Nuevo Contrato Conductor"
          onSubmit={createContractModal.onSubmit}
          onHide={createContractModal.hide}
        />
     )}
     

    </main>
  );
}
