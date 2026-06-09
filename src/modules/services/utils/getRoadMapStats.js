// Librarys
import * as XLSX from "xlsx";
import normalizeDate from "./normalizeDate";
import buildMonthlyReport from "./buildMonthlyReport";

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
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: null });

    rows.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell === "GUIA") {
          console.log("CABECERA COMPLETA", row);
          const commentColIndex = colIndex - 2;
          
          const dateColIndex = colIndex - 1;
          
          let lastDate = null;
          let lastComment = null;
          let lastProvider = null;
          let lastProduct = null;
          let lastDriver = null;
          
          let propagateNextRowComment = null;
          let emptyRows = 0;

          for (let i = rowIndex + 1; i < rows.length; i++) {
            const dataRow = rows[i];
            if (i >= 13 && i <= 15) {
  console.log("RAW ROW", i, dataRow);
}
            const guide = dataRow[colIndex];

            let provider = dataRow[colIndex + 2];
            let product = dataRow[colIndex + 5];
            let driver = dataRow[colIndex + 19];
            
            // HEREDAR CELDAS FUSIONADAS
            if (provider) {
              lastProvider = provider;
            } else {
              provider = lastProvider;
            }

            if (product) {
              lastProduct = product;
            } else {
              product = lastProduct;
            }

            if (driver) {
              lastDriver = driver;
            } else {
              driver = lastDriver;
            }

            const rawDate = dataRow[dateColIndex];
            const rawComment = dataRow[commentColIndex];

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

            const date = rawDate || lastDate;

            let comment = rawComment || lastComment;

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
              totalGuides += 1;
              console.log({
  row: i,
  guide,
  comment,
  rawComment,
});
console.log({
  guide,
  provider,
  product,
  driver,
});
            const d = normalizeDate(date);

            if (d) {
              const year = d.getFullYear();
              const month = d.toLocaleString("es-PE", {
                month: "short",
              });

              if (!timeline[year]) {
                timeline[year] = new Set();
              }

              timeline[year].add(month);
             console.log({
  row: i,
  guide,
  comment,
  rawComment,
});
              
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
