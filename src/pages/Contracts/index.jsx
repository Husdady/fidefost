// Components
import { useState } from "react";
import { useGetContracts, useAddContract } from "components/features/RapidUnitAudit/useContracts";
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
  const [selectedContract, setSelectedContract] = useState(null);
  const handleEdit = (contract) => {
  setSelectedContract(contract);
  createContractModal.show();
};

  const createContractModal = useShowModal();
  const audits = useGetContracts();
  const addContract = useAddContract();

  return (
    <main className="contracts-page main-container">
      <Navigation />

      <aside className="page-content d-flex flex-column row-gap-4">
        <PageHeader
          title="Gestion de los Contratos"
          description="Monitoreo y vinculación operativa de recursos."
        >
          <div className="d-flex align-items-center column-gap-3">
            <AddButton
              onClick={createContractModal.show}
              title="Crear Contrato de Seguro"
            />

            <AddButton
              onClick={() => {
                setSelectedContract(null);
                createContractModal.show();
              }}
              title="Nuevo Contrato de Unidades"
            />
          </div>
        </PageHeader>

        <ContractsSummary />
        <ContractsSection />
        <RapidUnitAudit 
          title="Auditoría Rapida de Unidades"
          data={audits}
          onEdit={(audit) => {
          setSelectedContract(audit);
          createContractModal.show();
        }}
        >
          <AddButton onClick={createContractModal.show} title="EXPORTAR" />
        </RapidUnitAudit>
      </aside>

      {createContractModal.isShowing && (
      <DriverContractForm
        contractId={selectedContract?._id || null}
        contractData={selectedContract}
        onHide={createContractModal.hide}
        onSave={(newData) => {
          addContract(newData);
          createContractModal.hide();
          setSelectedContract(null); 
        }}
      />
     )}
     

    </main>
  );
}
