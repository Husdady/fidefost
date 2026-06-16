import * as XLSX from "xlsx-js-style";

export default function exportUnitCarretaExcel(unit) {
  const data = [
    {
      MARCA: unit.marcaCarreta,
      PLACA_CARRETA: unit.placaCarreta,
      F_VENCIMIENTO_REVISION_TEC_CARRETA:
        unit.revisionFechaPC,
      MTC: unit.mtcCarreta,
      POLIZAS_CARGA_Y_CONTENEDOR:
        unit.polizaCarga,
      POLIZA_ENDOSO:
        unit.polizaEndoso,
      DOCUMENTACION_MTC:
        unit.documentos?.mtcCheckCarreta ? "SI" : "NO",
      DOCUMENTACION_POLIZAS:
        unit.documentos?.polizaCheck ? "SI" : "NO",
      DOCUMENTACION_REVISION_TEC:
        unit.documentos?.revisionTecnicaCarretaCheck ? "SI" : "NO",
      DOCUMENTACION_PERMISO_MUNICIPAL:
        unit.documentos?.permisoMunicipalCheck ? "SI" : "NO",
    },
  ];

  const sheet = XLSX.utils.json_to_sheet(data);

  const range = XLSX.utils.decode_range(sheet["!ref"]);

  for (let row = range.s.r; row <= range.e.r; row++) {
    for (let col = range.s.c; col <= range.e.c; col++) {
      const cellAddress = XLSX.utils.encode_cell({
        r: row,
        c: col,
      });

      if (!sheet[cellAddress]) continue;

      const isHeader = row === 0;

      if (isHeader) {
        sheet[cellAddress].v = String(
          sheet[cellAddress].v
        ).replaceAll("_", " ");
      }

      sheet[cellAddress].s = {
        font: {
          bold: isHeader,
          color: {
            rgb: isHeader ? "FFFFFF" : "000000",
          },
        },
        fill: isHeader
          ? {
              fgColor: { rgb: "1F4E78" },
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

  sheet["!cols"] = [
    { wch: 18 },
    { wch: 18 },
    { wch: 32 },
    { wch: 18 },
    { wch: 28 },
    { wch: 20 },
    { wch: 18 },
    { wch: 22 },
    { wch: 28 },
    { wch: 32 },
  ];

  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    sheet,
    "CARRETA"
  );

  XLSX.writeFile(
    workbook,
    `CARRETA-${unit.placaCarreta}.xlsx`
  );
}