import * as XLSX from "xlsx-js-style";

// Hooks
import { useCallback } from "react";
import { useGetServices } from "context/services/useServices";

// Utils
import formatDate from "utils/format/formatDate";
import buildMonthlyReport from "../utils/buildMonthlyReport";

//format date
const formatExcelDate = (date) => {
  if (!date) return "";

  const d = new Date(date);

  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = String(d.getFullYear()).slice(-2);

  return `${day}/${month}/${year}`;
};

export default function useExportReport({
    selectedYear,
    selectedMonth,
  } = {}) {
  const services = useGetServices();
  //
  const getDay = (date) =>
    new Date(date).getDate();

  //
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

    const tripGuides =
      guides.slice(index, index + size);

    const joinUnique = (field) =>
      [
        ...new Set(
          tripGuides
            .map((g) => g[field])
            .filter(Boolean)
        ),
      ].join(", ");

    spans.push({
      index,
      size,
      provider: joinUnique("provider"),
      product: joinUnique("product"),
      driver: joinUnique("driver"),
    });

    index += size;
  }

  return spans;
};
  //  

  const handleDownloadReport = useCallback(() => {
    if (
      selectedYear === "Todos" ||
      selectedMonth === "Todos"
    ) {
      return;
    }
    const guides = services
      .flatMap((service) => service.guides || [])
      .filter((guide) => {
        return (
          guide.year === selectedYear &&
          guide.month === selectedMonth
        );
      });

    const reportData =
      buildMonthlyReport(guides);

    const reportRows = [
      [
        `REPORTE MES DE ${selectedMonth.toUpperCase()} ${selectedYear}`
      ],
      [],
      [
        "COMENTARIO",
        "FECHA",
        "GUIA",
        "N° VIAJES",
        "PROVED",
        "PRODUCT",
        "CHOFER",
      ],
    ];

    const merges = [];

    const rowColors = {};
    let tripColorIndex = 0;

    reportData.forEach((group) => {
      const startRow = reportRows.length;

      group.guides.forEach((item) => {
        reportRows.push([
          group.comment,
          formatExcelDate(item.date),
          item.guide,
          "",
          "",
          "",
          "",
        ]);
      });

      const tripSpans =
        getTripSpans(group.guides);

      tripSpans.forEach((span) => {
        const tripStartRow =
          startRow + span.index;

        const tripEndRow =
          tripStartRow + span.size - 1;
        
        const tripColor =
          tripColorIndex % 2 === 0
            ? "F3F2F2"
            : "D9D9D9";

        for (
          let r = tripStartRow;
          r <= tripEndRow;
          r++
        ) {
          rowColors[r] = tripColor;
        }

        tripColorIndex++;

        reportRows[tripStartRow][3] = 1;
        reportRows[tripStartRow][4] = span.provider;
        reportRows[tripStartRow][5] = span.product;
        reportRows[tripStartRow][6] = span.driver;

        if (tripEndRow > tripStartRow) {
          merges.push(
            { s: { r: tripStartRow, c: 3 }, e: { r: tripEndRow, c: 3 } },
            { s: { r: tripStartRow, c: 4 }, e: { r: tripEndRow, c: 4 } },
            { s: { r: tripStartRow, c: 5 }, e: { r: tripEndRow, c: 5 } },
            { s: { r: tripStartRow, c: 6 }, e: { r: tripEndRow, c: 6 } }
          );
        }
      });

      const endRow = reportRows.length - 1;

      if (endRow > startRow) {
        merges.push(
          { s: { r: startRow, c: 0 }, e: { r: endRow, c: 0 } }
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
      "",
      "TOTAL",
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
      ["Fecha de generación", formatExcelDate(new Date())],
    ];

    const workbook =
      XLSX.utils.book_new();

    const summarySheet =
      XLSX.utils.aoa_to_sheet(summaryData);
    
    const summaryRange =
      XLSX.utils.decode_range(
        summarySheet["!ref"]
      );

    for (
      let row = summaryRange.s.r;
      row <= summaryRange.e.r;
      row++
    ) {
      for (
        let col = summaryRange.s.c;
        col <= summaryRange.e.c;
        col++
      ) {
        const cellAddress =
          XLSX.utils.encode_cell({
            r: row,
            c: col,
          });

        if (!summarySheet[cellAddress]) {
          continue;
        }

        const isTitle = row === 1;
        const isHeader = row === 3;

        summarySheet[cellAddress].s = {
          font: {
            bold: isTitle || isHeader,
            sz: isTitle ? 16 : 11,
            color: {
              rgb: isTitle ? "FFFFFF" : "000000",
            },
          },
          fill: isTitle
            ? {
                fgColor: { rgb: "1F4E78" },
              }
            : isHeader
            ? {
                fgColor: { rgb: "D9D9D9" },
              }
            : undefined,
          border: {
            top: { style: "thin" },
            bottom: { style: "thin" },
            left: { style: "thin" },
            right: { style: "thin" },
          },
          alignment: {
            horizontal: "center",
            vertical: "center",
            wrapText: true,
          },
        };
      }
    }

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
    const range =
      XLSX.utils.decode_range(
        reportSheet["!ref"]
      );

    for (
      let row = range.s.r;
      row <= range.e.r;
      row++
    ) {
      for (
        let col = range.s.c;
        col <= range.e.c;
        col++
      ) {
        const cellAddress =
          XLSX.utils.encode_cell({
            r: row,
            c: col,
          });

        if (!reportSheet[cellAddress]) {
          continue;
        }

        const isTitle = row === 0;
        const isHeader = row === 2;
        const isTotalRow =
          reportRows[row]?.[1] === "TOTAL";

        const isTotal =
          isTotalRow && col >= 1 && col <= 3;

        reportSheet[cellAddress].s = {
          font: {
            bold: isTitle || isHeader || isTotal,
            sz: isTitle
              ? 18
              : isTotal
              ? 16
              : 11,
            color: {
              rgb:
                isTitle || isHeader
                  ? "FFFFFF"
                  : "000000",
            },
          },

          fill: isTitle
            ? {
                fgColor: { rgb: "44546A" }
              }
            : isHeader
            ? {
                fgColor: { rgb: "1F4E78" },
              }
            : isTotal
            ? {
                fgColor: { rgb: "D9D9D9" },
              }
            : col === 0 && !isTotalRow
            ? {
                fgColor: { rgb: "FFFF00" }
              }
            : rowColors[row]
            ? {
                fgColor: { rgb: rowColors[row] }
              }
            : undefined,

          border: isTotal || !isTotalRow
            ? {
                top: { style: isTotal ? "medium" : "thin" },
                bottom: { style: isTotal ? "medium" : "thin" },
                left: { style: isTotal ? "medium" : "thin" },
                right: { style: isTotal ? "medium" : "thin" },
              }
            : undefined,
          alignment: {
            horizontal: "center",
            vertical: "center",
            wrapText: true,
          },
        };
      }
    }
    reportSheet["!merges"] = [
      {
        s: { r: 0, c: 0 },
        e: { r: 0, c: 6 },
      },
      ...merges,
    ];

    reportSheet["!cols"] = [
      { wch: 15 }, // COMENTARIO
      { wch: 10 }, // FECHA
      { wch: 18 }, // GUIA
      { wch: 10 }, // N° VIAJES
      { wch: 16 }, // PROVED
      { wch: 24 }, // PRODUCT
      { wch: 20 }, // CHOFER
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
      `reporte_${selectedMonth}_${selectedYear}.xlsx`
    );
  }, [services, selectedYear, selectedMonth]);

  return {
    handleDownloadReport,
  };
}