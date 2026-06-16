import * as XLSX from "xlsx-js-style";

export default function exportUnitTractorExcel(unit) {
  const formatDate = (dateString) => {
    if (!dateString) {
      return "-";
    }

    const [year, month, day] =
      dateString.split("-");

    return `${day}/${month}/${year}`;
  };
  const data = [
    {
      MARCA: unit.marcaTractor,

      PLACA_TRACTOR:
        unit.placaTractor,

      F_VENCIMIENTO_REVISION_TEC_TRACTOR:
        formatDate(unit.revisionFechaPT),

      MTC:
        unit.mtcTractor,

      TARJETA_VEHICULAR:
        unit.tarjetaVehicularInfo,

      SOAT:
        unit.soat,

      POLIZA_VEHICULAR:
        unit.polizaVehicular,

      POLIZAS_CARGA_Y_CONTENEDOR:
        unit.polizaCarga,

      POLIZA_ENDOSO:
        unit.polizaEndoso,

      DOCUMENTACION_MTC:
        unit.documentos?.mtcCheckTractor
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

      DOCUMENTACION_REVISION_TEC:
        unit.documentos?.revisionTecnicaTractorCheck
          ? "SI"
          : "NO",

      DOCUMENTACION_PERMISO_MUNICIPAL:
        unit.documentos?.permisoMunicipalCheck
          ? "SI"
          : "NO",
    },
  ];

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

      const isHeader =
        row === 0;

      // Reemplazar "_" por espacios
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
    { wch: 18 }, // MARCA
    { wch: 18 }, // PLACA
    { wch: 32 }, // REVISION
    { wch: 18 }, // MTC
    { wch: 20 }, // TARJETA
    { wch: 18 }, // SOAT
    { wch: 20 }, // POLIZA VEHICULAR
    { wch: 28 }, // POLIZA CARGA
    { wch: 20 }, // ENDOSO
    { wch: 18 }, // DOC MTC
    { wch: 18 }, // DOC SOAT
    { wch: 18 }, // DOC POLIZA
    { wch: 24 }, // DOC TARJETA
    { wch: 24 }, // DOC REVISION
    { wch: 30 }, // DOC MUNICIPAL
  ];

  const workbook =
    XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "TRACTOR"
  );

  XLSX.writeFile(
    workbook,
    `TRACTOR-${unit.placaTractor}.xlsx`
  );
}