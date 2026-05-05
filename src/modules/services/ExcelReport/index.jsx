// Hooks
import useExportReport from "./useExportReport";

// Icons
import DownloadIcon from "components/icons/download-icon";

export default function ExportReport() {
  const { handleDownloadReport } = useExportReport();

  return (
    <section className="export-report">
      <div className="export-report-content">
        <h2 className="export-report-title mb-0">
          Exportación
          <br />
          Automatizada
        </h2>

        <p className="export-report-description mb-0">
          Genera reportes operativos consolidados para cierre de mes en
          segundos.
        </p>

        <div className="export-report-fields d-flex flex-column">
          <div className="export-report-field d-flex align-items-center justify-content-between">
            <span>Mes</span>
            <strong>OCTUBRE 2023</strong>
          </div>

          <div className="export-report-field d-flex align-items-center justify-content-between">
            <span>Formato</span>
            <strong>EXCEL PREMIUM</strong>
          </div>
        </div>

        <button
          type="button"
          className="export-report-button d-flex align-items-center justify-content-center"
          onClick={handleDownloadReport}
        >
          <DownloadIcon />
          <span>Descargar Reporte</span>
        </button>
      </div>
    </section>
  );
}
