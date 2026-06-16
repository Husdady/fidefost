import * as XLSX from "xlsx-js-style";

export default function exportUnitsExcel(units) {
  const data = units.map((unit) => ({
    MARCA_TRACTOR: unit.marcaTractor,
    PLACA_TRACTOR: unit.placaTractor,
    F_VENCIMIENTO_REVISION_TEC_TRACTOR:
      unit.revisionFechaPT,
    MTC_TRACTOR: unit.mtcTractor,

    MARCA_CARRETA: unit.marcaCarreta,
    PLACA_CARRETA: unit.placaCarreta,
    F_VENCIMIENTO_REVISION_TECNICA_CARRETA:
      unit.revisionFechaPC,
    MTC_CARRETA: unit.mtcCarreta,

    TARJETA_VEHICULAR:
      unit.tarjetaVehicularInfo,

    SOAT: unit.soat,
    POLIZA_VEHICULAR: unit.polizaVehicular,
    POLIZAS_CARGA_CONTENEDOR: unit.polizaCarga,
    POLIZA_ENDOSO: unit.polizaEndoso,

    DOCUMENTACION_MTC_TRACTOR:
      unit.documentos?.mtcCheckTractor
        ? "SI"
        : "NO",

    DOCUMENTACION_MTC_CARRETA:
      unit.documentos?.mtcCheckCarreta
        ? "SI"
        : "NO",

    DOCUMENTACION_SOAT:
      unit.documentos?.soatCheck
        ? "SI"
        : "NO",

    DOCUMENTACION_POLIZAS:
      unit.documentos?.polizaCheck
        ? "SI"
        : "NO",

    DOCUMENTACION_TARJETA_VEHICULAR:
      unit.documentos?.tarjetaVehicularCheck
        ? "SI"
        : "NO",

    DOCUMENTACION_REVISION_TECNICA_TRACTOR:
      unit.documentos?.revisionTecnicaTractorCheck
        ? "SI"
        : "NO",

    DOCUMENTACION_REVISION_TECNICA_CARRETA:
      unit.documentos?.revisionTecnicaCarretaCheck
        ? "SI"
        : "NO",

    DOCUMENTACION_PERMISO_MUNICIPAL:
      unit.documentos?.permisoMunicipalCheck
        ? "SI"
        : "NO",
  }));

  const worksheet =
    XLSX.utils.json_to_sheet(data);

  const range =
    XLSX.utils.decode_range(
      worksheet["!ref"]
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

      if (!worksheet[cellAddress]) {
        continue;
      }

      const isHeader = row === 0;

      if (isHeader) {
        worksheet[cellAddress].v =
          String(
            worksheet[cellAddress].v
          ).replaceAll("_", " ");
      }

      worksheet[cellAddress].s = {
        font: {
          bold: isHeader,
          color: {
            rgb: isHeader
              ? "FFFFFF"
              : "000000",
          },
        },

        fill: isHeader
          ? {
              fgColor: {
                rgb: "1F4E78",
              },
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

  worksheet["!cols"] = [
    { wch: 18 },
    { wch: 18 },
    { wch: 32 },
    { wch: 18 },

    { wch: 18 },
    { wch: 18 },
    { wch: 34 },
    { wch: 18 },

    { wch: 24 },

    { wch: 18 },
    { wch: 22 },
    { wch: 28 },
    { wch: 20 },

    { wch: 24 },
    { wch: 24 },
    { wch: 20 },
    { wch: 22 },
    { wch: 34 },
    { wch: 34 },
    { wch: 34 },
    { wch: 32 },
  ];

  const workbook =
    XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "UNIDADES"
  );

  XLSX.writeFile(
    workbook,
    "UNIDADES.xlsx"
  );
}