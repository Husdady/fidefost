// Librarys
import * as XLSX from "xlsx";
import normalizeDate from "./normalizeDate";
import buildMonthlyReport from "./buildMonthlyReport";

const normalizeHeader = (value) =>
  String(value || "")
    .trim()
    .toUpperCase();
/**
 * Callback for get road maps stats
 * @param {File|FileList} file File
 */
export async function getRoadMapStats(file) {

  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array", cellDates: true });

  let totalGuides = 0;
  
  const years = new Set();
  const months = new Set();
  const guides = [];

  const timeline = {};

  workbook.SheetNames.forEach((sheetName) => {
    const sheet = workbook.Sheets[sheetName];
    console.log("MERGES", sheet["!merges"]);
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: null });

    const getMergedCellValue = (rowIndex, colIndex) => {
    const merges = sheet["!merges"] || [];

    const merge = merges.find((item) => {
      return (
        rowIndex >= item.s.r &&
        rowIndex <= item.e.r &&
        colIndex >= item.s.c &&
        colIndex <= item.e.c
      );
    });

    if (!merge) {
      return null;
    }

    return rows[merge.s.r]?.[merge.s.c] || null;
  };
    rows.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell === "GUIA") {
          const normalizedHeaders = row.map(normalizeHeader);
          //volumen//
          const commentColIndex = colIndex - 2;
          const dateColIndex = colIndex - 1;
          const guideColIndex = colIndex;

          const findHeaderNearGuide = (headerName) => {
          const start = colIndex;
          const end = Math.min(row.length - 1, colIndex + 25);

          for (let i = start; i <= end; i++) {
            const header = String(row[i] || "")
              .trim()
              .toUpperCase();

            if (header === headerName) {
              return i;
            }
          }

          return -1;
        };

          const providerColIndex =
            findHeaderNearGuide("PROVED");

          const productColIndex =
            findHeaderNearGuide("PRODUCT");

          const driverColIndex =
            findHeaderNearGuide("CHOFER");
          
          let lastDate = null;
          let lastComment = null;
          
          let propagateNextRowComment = null;
          let emptyRows = 0;

          for (let i = rowIndex + 1; i < rows.length; i++) {
            const dataRow = rows[i];
            if (i >= 13 && i <= 15) {
  console.log("RAW ROW", i, dataRow);
}
            const guide = dataRow[guideColIndex];

            let provider =
              providerColIndex >= 0
                ? dataRow[providerColIndex] ||
                  getMergedCellValue(i, providerColIndex)
                : null;

            let product =
              productColIndex >= 0
                ? dataRow[productColIndex] ||
                  getMergedCellValue(i, productColIndex)
                : null;

            let driver =
              driverColIndex >= 0
                ? dataRow[driverColIndex] ||
                  getMergedCellValue(i, driverColIndex)
                : null;

            const rawDate =
              dataRow[dateColIndex];

            const rawComment =
              dataRow[commentColIndex];

            if (rawDate) {
              const currentDate = normalizeDate(rawDate);
              const previousDate = normalizeDate(lastDate);

              const changedDate =
                !previousDate ||
                currentDate?.getTime() !== previousDate?.getTime();

              if (changedDate && !rawComment) {
                lastComment = null;
              }

              lastDate = rawDate;
            }

            const maxTwoGuidesComments = [
              "SE CARGO EN UN SOLO VIAJE",
              "SE CARGO EN DOS PUNTOS EN UN SOLO VIAJE",
            ];

            if (
              maxTwoGuidesComments.includes(rawComment)
            ) {
              propagateNextRowComment = rawComment;
            }

            if (rawComment) {
              lastComment = rawComment;
            }

            const mergedDate =
              getMergedCellValue(i, dateColIndex);

            const mergedComment =
              getMergedCellValue(i, commentColIndex);

            let comment =
              rawComment || mergedComment || lastComment;
            // Algunos Excel no reportan la fecha como combinada,
            // pero si pertenece a los comentarios agrupados,
            // puede heredar la última fecha válida.
            const date =
              rawDate ||
              mergedDate ||
              (
                maxTwoGuidesComments.includes(comment)
                  ? lastDate
                  : null
              );

              const dTest = normalizeDate(date);

if (
  guide === "EG04-00000446" ||
  guide === "EG04-00000447"
) {
  console.log("GUIA 19 DEBUG", {
    row: i,
    guide,
    rawDate,
    mergedDate,
    date,
    rawComment,
    mergedComment,
    lastComment,
    comment,
  });
}

            if (
              !rawComment &&
              propagateNextRowComment
            ) {
              comment = propagateNextRowComment;
              propagateNextRowComment = null;
            }
            if (
              maxTwoGuidesComments.includes(lastComment) &&
              !propagateNextRowComment &&
              !rawComment
            ) {
              lastComment = null;
            }
            // Fin de la tabla
            if (guide == null || guide === "") {
              emptyRows += 1;

              if (emptyRows >= 3) {
                break;
              }

              continue;
            }

            emptyRows = 0;

            if (
              typeof guide === "string" &&
              guide.includes("-")
            ) {
              console.log("verificar",{
  row: i,
  rawDate,
  lastDate,
  guide,
  comment,
});
              const d = normalizeDate(date);

              if (!d) {
                continue;
              }

              totalGuides += 1;

              const year = d.getFullYear();
              const month = d.toLocaleString("es-PE", {
                month: "short",
              });

              if (!timeline[year]) {
                timeline[year] = new Set();
              }

              timeline[year].add(month);

              guides.push({
                year: d.getFullYear(),
                month: d.toLocaleString("es-PE", {
                  month: "short",
                }),
                date: d,
                comment,
                guide,
                provider,
                product,
                driver,
              });

              years.add(d.getFullYear());

              months.add(
                d.toLocaleString("es-PE", {
                  month: "short",
                })
              );
            }
          }
        }
      });
    });
  });
console.log("GUIAS REPORTE", guides.slice(0, 5));
console.log(
  "FIRST_20_GUIDES",
  guides.slice(0, 20)
);
console.log(
  "GUIDES_WITH_NULLS",
  guides.filter(
    (g) =>
      !g.provider ||
      !g.product ||
      !g.driver
  )
);
  const reportData = buildMonthlyReport(guides);

console.log("REPORT_DATA", reportData);
console.log("TOTAL_GUIDES", guides.length);
  return {
    totalGuides,

    years: [...years],
    months: [...months],
    guides,
  };
}
