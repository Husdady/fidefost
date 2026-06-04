// Librarys
import * as XLSX from "xlsx";

/**
 * Callback for get road maps stats
 * @param {File|FileList} file File
 */
export async function getRoadMapStats(file) {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array", cellDates: true });

  let totalGuides = 0;
  const travelDays = new Set();

  workbook.SheetNames.forEach((sheetName) => {
    const sheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: null });

    rows.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell === "GUIA") {
          const dateColIndex = colIndex - 1;

          for (let i = rowIndex + 1; i < rows.length; i++) {
            const dataRow = rows[i];
            const guide = dataRow[colIndex];
            const date = dataRow[dateColIndex];

            // Fin de la tabla
            if (!guide) {
              break;
            }

            if (
              typeof guide === "string" &&
              guide.includes("-")
            ) {
              totalGuides += 1;

              if (date instanceof Date) {
                travelDays.add(
                  date.toISOString().slice(0, 10)
                );
              }
            }
          }
        }
      });
    });
  });

  return {
    totalGuides: totalGuides,
    tripsPerDay: travelDays.size ? totalGuides / travelDays.size : 0,
  };
}
