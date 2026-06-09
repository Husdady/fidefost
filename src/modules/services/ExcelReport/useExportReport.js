import * as XLSX from "xlsx";

// Hooks
import { useCallback } from "react";
import { useGetServices } from "context/services/useServices";

// Utils
import formatDate from "utils/format/formatDate";
import buildMonthlyReport from "../utils/buildMonthlyReport";

/**
 * Hook for implements ExportReport logic
 */
export default function useExportReport() {
  const services = useGetServices();
  //
  const getDay = (date) =>
    new Date(date).getDate();

  const getTripSpans = (guides = []) => {
    const spans = [];

    let index = 0;

    while (index < guides.length) {
      const current = guides[index];
      const next = guides[index + 1];

      let size = 1;

      if (
        current.comment ===
          "SE CARGO EN DOS PUNTOS EN UN SOLO VIAJE" &&
        next?.comment === current.comment
      ) {
        size = 2;
      }

      if (
        current.comment ===
          "SE CARGO EN UN SOLO VIAJE" &&
        next?.comment === current.comment &&
        getDay(current.date) === getDay(next.date)
      ) {
        size = 2;
      }

      spans.push({
        index,
        size,
      });

      index += size;
    }

    return spans;
  };
  //  

  const handleDownloadReport = useCallback(() => {
    const guides = services.flatMap(
      (service) => service.guides || []
    );

    const reportData =
      buildMonthlyReport(guides);

    const reportRows = [
      [
        "COMENTARIO",
        "FECHA",
        "GUIA",
        "N° VIAJES",
        "CHOFER",
        "PROVED",
        "PRODUCT",
      ],
    ];

    const merges = [];

    reportData.forEach((group) => {
      const startRow = reportRows.length;

      group.guides.forEach((item) => {
        reportRows.push([
          group.comment,
          formatDate(item.date),
          item.guide,
          "",
          group.driver,
          group.provider,
          group.product,
        ]);
      });

      const tripSpans =
        getTripSpans(group.guides);

      tripSpans.forEach((span) => {
        const tripStartRow =
          startRow + span.index;

        const tripEndRow =
          tripStartRow + span.size - 1;

        reportRows[tripStartRow][3] = 1;

        if (tripEndRow > tripStartRow) {
          merges.push({
            s: { r: tripStartRow, c: 3 },
            e: { r: tripEndRow, c: 3 },
          });
        }
      });

      const endRow = reportRows.length - 1;

      if (endRow > startRow) {
        merges.push(
          { s: { r: startRow, c: 0 }, e: { r: endRow, c: 0 } },
          { s: { r: startRow, c: 4 }, e: { r: endRow, c: 4 } },
          { s: { r: startRow, c: 5 }, e: { r: endRow, c: 5 } },
          { s: { r: startRow, c: 6 }, e: { r: endRow, c: 6 } }
        );
      }
    });

    const totalGuides = reportData.reduce(
      (total, group) => total + group.totalGuides,
      0
    );

    const totalTrips = reportData.reduce(
      (total, group) => total + group.totalTrips,
      0
    );

    reportRows.push([
      "TOTAL",
      "",
      totalGuides,
      totalTrips,
      "",
      "",
      "",
    ]);

    const summaryData = [
      [],
      ["EXPORTACIÓN AUTOMATIZADA"],
      [],
      ["MÉTRICA", "VALOR"],
      ["Total guías", totalGuides],
      ["Total viajes", totalTrips],
      ["Fecha de generación", formatDate(new Date())],
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

    const reportSheet =
      XLSX.utils.aoa_to_sheet(reportRows);

    reportSheet["!merges"] = merges;

    reportSheet["!cols"] = [
      { wch: 38 },
      { wch: 16 },
      { wch: 20 },
      { wch: 14 },
      { wch: 24 },
      { wch: 24 },
      { wch: 35 },
    ];

    XLSX.utils.book_append_sheet(
      workbook,
      summarySheet,
      "Resumen"
    );

    XLSX.utils.book_append_sheet(
      workbook,
      reportSheet,
      "Reporte"
    );

    XLSX.writeFile(
      workbook,
      "reporte_operativo.xlsx"
    );
  }, [services]);

  return {
    handleDownloadReport,
  };
}