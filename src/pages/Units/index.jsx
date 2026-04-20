// Components
import Navigation from "components/features/Navigation";
import PageHeader from "components/features/PageHeader";
import UnitsSummary from "modules/units/Summary";
import AddButton from "components/features/PageHeader/AddButton";

// Hooks
import useShowModal from "hooks/useShowModal";

export default function Units() {
  const createUnitModal = useShowModal();

  return (
    <main className="units-page main-container">
      <Navigation />
      <aside className="page-content d-flex flex-column row-gap-4">
        <PageHeader
          title="Gestión Técnica de Flotas"
          description="Control operativo y vigencia de documentación técnica para unidades pesadas."
        >
          <AddButton
            onClick={createOperatorModal.show}
            title="Agregar Nueva Unidad"
          />
        </PageHeader>

        <UnitsSummary />
      </aside>

    </main>
  );
}
