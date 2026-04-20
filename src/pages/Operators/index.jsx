// Components
import Navigation from "components/features/Navigation";
import PageHeader from "components/features/PageHeader";
import OperatorsSummary from "modules/operators/Summary";
import OperatorForm from "modules/operators/OperatorForm";
import AddButton from "components/features/PageHeader/AddButton";

// Hooks
import useShowModal from "hooks/useShowModal";

export default function Operators() {
  const createOperatorModal = useShowModal();

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
      </aside>

      {createOperatorModal.isShowing && (
        <OperatorForm isShowing onHide={createOperatorModal.hide} />
      )}
    </main>
  );
}
