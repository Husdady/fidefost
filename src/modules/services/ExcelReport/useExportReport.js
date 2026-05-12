// Librarys
import * as XLSX from "xlsx";

// Hooks
import { useCallback } from "react";
import { useGetServices } from "context/services/useServices";

// Utils
import formatDate from "utils/format/formatDate";
import formatFileSize from "utils/format/formatFileSize";

/**
 * Hook for implements ExportReport logic
 */
export default function useExportReport() {
  const services = useGetServices();

  // Callback for download report
  const handleDownloadReport = useCallback(() => {
    const totalSize = services.reduce(
      (total, service) => total + Number(service?.fileSize || 0),
      0
    );

    const reportRows = services.map((service, index) => ({
      "#": index + 1,
      ID: service?._id || "-",
      Archivo: service?.fileName || "-",
      Tamaño: formatFileSize(service?.fileSize),
      "Tamaño en bytes": service?.fileSize || 0,
      "Fecha de subida": formatDate(service?.date),
      "Fecha de origen": formatDate(service?.lastModified),
    }));

    const summaryData = [
    [],
    ["EXPORTACIÓN AUTOMATIZADA"],
    [],
    ["MÉTRICA", "VALOR"],

    [
    "Total de archivos subidos",
      String(services.length),
    ],

    [
      "Tamaño total",
      String(formatFileSize(totalSize)),
    ],

    [
      "Fecha de generación del reporte",
      formatDate(new Date()),
    ],
  ];

  const workbook =
    XLSX.utils.book_new();

  const summarySheet =
    XLSX.utils.aoa_to_sheet(summaryData);
  
  summarySheet["!cols"] = [
    { wch: 38 },
    { wch: 20 },
  ];

  summarySheet["!merges"] = [
    {
      s: { r: 1, c: 0 },
      e: { r: 1, c: 1 },
    },
  ];

    const reportSheet = XLSX.utils.json_to_sheet(reportRows);

    reportSheet["!cols"] = [
      { wch: 8 },
      { wch: 38 },
      { wch: 35 },
      { wch: 16 },
      { wch: 18 },
      { wch: 32 },
      { wch: 32 },
    ];

    XLSX.utils.book_append_sheet(workbook, summarySheet, "Resumen");
    XLSX.utils.book_append_sheet(workbook, reportSheet, "Archivos");

    XLSX.writeFile(workbook, "reporte_hojas_de_ruta.xlsx");
  }, [services]);

  return {
    handleDownloadReport,
  };
}
