// Components
import Navigation from "components/features/Navigation";
import PageHeader from "components/features/PageHeader";
import OperatorsSummary from "modules/operators/Summary";
import OperatorForm from "modules/operators/OperatorForm";
import OperatorList from "modules/operators/OperatorList";
import AddButton from "components/features/PageHeader/AddButton";

// Hooks
import useOperators from "./useOperators";

export default function Operators() {
  const { createOperatorModal, handleCreateOperator } = useOperators();

  return (
    <main className="operators-page main-container">
      <Navigation />

      <aside className="page-content d-flex flex-column row-gap-4">
        <PageHeader
          title="Operadores"
          description="Gestión integral del padrón de operadores y documentación legal."
        >
          <AddButton
            onClick={createOperatorModal.show}
            title="Crear Nuevo Cliente"
          />
        </PageHeader>

        <OperatorsSummary />
        <OperatorList />
      </aside>

      {createOperatorModal.isShowing && (
        <OperatorForm
          isShowing
          title="Crear Nuevo Cliente"
          onSubmit={handleCreateOperator}
          onHide={createOperatorModal.hide}
        />
      )}
    </main>
  );
}
