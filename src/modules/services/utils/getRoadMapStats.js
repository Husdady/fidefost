// Librarys
import * as XLSX from "xlsx";
import normalizeDate from "./normalizeDate";
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
          const commentColIndex = colIndex - 2;
          
          const dateColIndex = colIndex - 1;
          
          let lastDate = null;
          let lastComment = null;
          let propagateNextRowComment = null;
          let emptyRows = 0;

          for (let i = rowIndex + 1; i < rows.length; i++) {
            const dataRow = rows[i];
            const guide = dataRow[colIndex];
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

            if (
              rawComment ===
              "SE CARGO EN DOS PUNTOS EN UN SOLO VIAJE"
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
              console.log("ROW", i, {
  rawComment,
  rawDate,
  guide,
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
             console.log("PUSH", {
  guide,
  rawComment,
  lastComment,
  comment,
});
              
              guides.push({
                year: d.getFullYear(),
                month: d.toLocaleString("es-PE", {
                  month: "short",
                }),
                date: d,
                comment,
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

  return {
    totalGuides,

    years: [...years],
    months: [...months],
    guides,
  };
}
