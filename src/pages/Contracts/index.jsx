// Components
import { useGetContracts, useAddContract, useUpdateContract } from "components/features/RapidUnitAudit/useContracts";
import { useState } from "react";
import Navigation from "components/features/Navigation";
import PageHeader from "components/features/PageHeader";
import ContractsSummary from "modules/contracts/Summary";
import AddButton from "components/features/PageHeader/AddButton";
import RapidUnitAudit from "components/features/RapidUnitAudit";
import ContractsSection from "modules/contracts/ContractsSection";
import DriverContractForm from "modules/contracts/DriverContractForm";
import DriverContractView from "modules/contracts/DriversContractView";
import { useDeleteContract } from "components/features/RapidUnitAudit/useContracts";
import getDocumentsByRelation from "database/getDocumentsByRelation";
import { deleteDocument } from "database/deleteDocument";

// Hooks
import useShowModal from "hooks/useShowModal";

export default function Contracts() {
  const [viewContract, setViewContract] = useState(null);
  const [refresh, setRefresh] = useState(0);
  const updateContract = useUpdateContract();
  const [selectedContract, setSelectedContract] = useState(null);
  const handleDelete = async (contract) => {

  // obtener archivos relacionados
  const files = await getDocumentsByRelation(
    "contracts",
    contract._id
  );

  // eliminar archivos del indexeddb
  for (const file of files) {
    await deleteDocument(file.id);
  }

  // eliminar contrato del store
  deleteContract(contract._id);

  setViewContract(null);
  };

  const handleEdit = (contract) => {
  setSelectedContract(contract);
  createContractModal.show();
  };
  
  const toggleEstado = (id) => {
  console.log("Cambiar estado:", id);
};

  const createContractModal = useShowModal();
  const audits = useGetContracts(refresh);
  const addContract = useAddContract();
  const deleteContract = useDeleteContract();

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
          onView={(audit) => {
          setViewContract(audit);
        }}
        >
          <AddButton onClick={createContractModal.show} title="EXPORTAR" />
        </RapidUnitAudit>
      </aside>

      {createContractModal.isShowing && (
      <DriverContractForm
        contractData={selectedContract}
        onHide={createContractModal.hide}
        onSave={(newData, isEdit) => {
          if (isEdit) {
            updateContract(newData._id, newData); 
          } else {

            addContract(newData);
          }

          createContractModal.hide();
          setSelectedContract(null);
        }}
      /> 
     )}

     {viewContract && (
      <DriverContractView
        contractData={viewContract}
        onHide={() => setViewContract(null)}
        onDelete={handleDelete}
      />
    )}

    </main>
  );
}
