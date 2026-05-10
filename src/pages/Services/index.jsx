// Components
import RoadMaps from "modules/services/RoadMaps";
import Navigation from "components/features/Navigation";
import PageHeader from "components/features/PageHeader";
import ExportReport from "modules/services/ExcelReport";
import ExportButton from "modules/services/ExportButton";
import TravelVolume from "modules/services/TravelVolume";
import UploadRoadMap from "modules/services/UploadRoadMap";
import RecentActivity from "modules/services/RecentActivity";
import UploadRoadMapButton from "modules/services/UploadRoadMapButton";

// Hooks
import useShowModal from "hooks/useShowModal";

export default function Services() {
  return (
    <main className="services-page main-container h-100">
      <Navigation />

      <aside className="page-content d-flex flex-column row-gap-2 h-100">
        <PageHeader
          title="Gestión de Servicios"
          description="Administración de hojas de ruta, despachos y métricas mensuales"
        >
          <div className="d-flex align-items-center column-gap-3">
            <ExportButton />
            <UploadRoadMapButton />
          </div>
        </PageHeader>

        <div className="services-page-content d-flex align-items-start column-gap-3">
          <aside className="left-content d-flex flex-column row-gap-3">
            <UploadRoadMap />
            <RoadMaps />
          </aside>

          <aside className="right-content d-flex flex-column row-gap-3">
            <ExportReport />
            <TravelVolume />
            <RecentActivity />
          </aside>
        </div>
      </aside>
    </main>
  );
}
