// Components
import Navigation from "components/features/Navigation";
import PageHeader from "components/features/PageHeader";
import AddButton from "components/features/PageHeader/AddButton";

// Hooks
import useShowModal from "hooks/useShowModal";

export default function Services() {
  const createServiceModal = useShowModal();

  return (
    <main className="services-page main-container">
      <Navigation />

      <aside className="page-content d-flex flex-column row-gap-4">
        <PageHeader
          title="Gestión de Servicios"
          description="Administración de hojas de ruta, despachos y métricas mensuales"
        >
          <AddButton
            onClick={createOperatorModal.show}
            title="EXPORTAR TODO"
          />
          <AddButton
            onClick={createOperatorModal.show}
            title="CARGAR HOJA DE RUTA"
          />
        </PageHeader>
        </aside>
    </main>
  );
}
