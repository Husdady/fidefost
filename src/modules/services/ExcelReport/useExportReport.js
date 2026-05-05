// ExportReport/useExportReport.js
import * as XLSX from "xlsx";

// Hooks
import { useGetServices } from "context/services/useServices";

/**
 * Hook for implements ExportReport logic
 */
export default function useExportReport() {
  const services = useGetServices();

  /**
   * Formats file size from bytes to MB
   * @param {number} size File size in bytes
   * @returns {string}
   */
  const formatFileSize = (size) => {
    if (!size) return "0 MB";

    return `${(size / 1024 / 1024).toFixed(2)} MB`;
  };

  /**
   * Formats date value
   * @param {Date|string|number} date Date value
   * @returns {string}
   */
  const formatDate = (date) => {
    if (!date) return "-";

    return new Intl.DateTimeFormat("es-PE", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date(date));
  };

  /**
   * Gets readable status label
   * @param {string} status File status
   * @returns {string}
   */
  const getStatusLabel = (status) => {
    const statuses = {
      pending: "Pendiente",
      processed: "Procesado",
      error: "Error",
    };

    return statuses[status] || "Pendiente";
  };

  /**
   * Downloads services report as XLSX
   */
  const handleDownloadReport = () => {
    const reportRows = services.map((service, index) => ({
      "#": index + 1,
      ID: service?._id || "-",
      "Nombre del archivo": service?.fileName || "-",
      "Tamaño": formatFileSize(service?.fileSize),
      "Tamaño en bytes": service?.fileSize || 0,
      "Fecha de modificación": formatDate(service?.date),
      Estado: getStatusLabel(service?.status),
    }));

    const summaryRows = [
      {
        Métrica: "Total de archivos",
        Valor: services.length,
      },
      {
        Métrica: "Archivos pendientes",
        Valor: services.filter((service) => service?.status === "pending")
          .length,
      },
      {
        Métrica: "Archivos procesados",
        Valor: services.filter((service) => service?.status === "processed")
          .length,
      },
      {
        Métrica: "Archivos con error",
        Valor: services.filter((service) => service?.status === "error")
          .length,
      },
    ];

    const workbook = XLSX.utils.book_new();

    const summarySheet = XLSX.utils.json_to_sheet(summaryRows);
    const reportSheet = XLSX.utils.json_to_sheet(reportRows);

    XLSX.utils.book_append_sheet(workbook, summarySheet, "Resumen");
    XLSX.utils.book_append_sheet(workbook, reportSheet, "Servicios");

    XLSX.writeFile(workbook, "reporte_servicios.xlsx");
  };

  return {
    handleDownloadReport,
  };
}