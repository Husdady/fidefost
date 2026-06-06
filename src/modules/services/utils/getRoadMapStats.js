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

          for (let i = rowIndex + 1; i < rows.length; i++) {
            const dataRow = rows[i];
            const guide = dataRow[colIndex];
            const rawDate = dataRow[dateColIndex];
            const rawComment = dataRow[commentColIndex];

            if (rawDate) {
              lastDate = rawDate;

              // Si comienza un nuevo bloque sin comentario,
              // eliminamos el comentario heredado anterior
              if (!rawComment) {
                lastComment = null;
              }
            }

            if (rawComment) {
              lastComment = rawComment;
            }

            const date = rawDate || lastDate;
            const comment = rawComment || lastComment;
            // Fin de la tabla
            if (guide == null || guide === "") {
              break;
            }

            if (
              typeof guide === "string" &&
              guide.includes("-")
            ) {
              totalGuides += 1;
            console.log({
  guide,
  comment,
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
