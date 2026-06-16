import * as XLSX from "xlsx-js-style";
import useGpsContractsStore from "context/contracts/gpsContractsStore";

export default function exportAuditExcel(
  data,
  fileName = "auditoria"
) {
  const arrayData =
    Array.isArray(data)
      ? data
      : [data];

  const gpsContracts =
    useGpsContractsStore.getState()
      .gpsContracts;

  const formatDate = (dateString) => {
    if (!dateString) {
      return "-";
    }

    const [year, month, day] =
      dateString.split("-");

    return `${day}/${month}/${year}`;
  };

  const excelData = arrayData.map((audit) => {
    const gpsData =
      gpsContracts.find(
        (gps) =>
          gps.id === audit.gpsId
      );

    return {
      Conductor:
        audit.auditDriver,

      Licencia:
        audit.auditLicense,

      Fecha_Vencimiento:
        formatDate(
          audit.auditLicenseExpiration
        ),

      Inducciones:
        audit.auditInductions,

      Inicio_Contrato:
        formatDate(
          audit.auditContract?.start
        ),

      Fin_Contrato:
        formatDate(
          audit.auditContract?.end
        ),

      Dias_Activos:
        audit.auditContract?.days,

      Estado:
        audit.auditOperationalStatus,

      Placa_Tractor:
        audit.auditUnidad?.placaTractor,

      Marca_Tractor:
        audit.auditUnidad?.marcaTractor,

      Placa_Carreta:
        audit.auditUnidad?.placaCarreta,

      Marca_Carreta:
        audit.auditUnidad?.marcaCarreta,

      GPS:
        audit.gps ? "SI" : "NO",

      ID_GPS:
        audit.gpsId || "-",

      Proveedor_GPS:
        gpsData?.provider || "-",

      Link_GPS:
        gpsData?.gpsLink || "-",

      FI_CONTRATO:
        formatDate(
          gpsData?.installationDate || ""
        ),

      FV_CONTRATO:
        formatDate(
          gpsData?.endDate || ""
        ),

      Wifi:
        audit.wifi ? "SI" : "NO",

      Doc_Brevete:
        audit.documentos?.brevete
          ? "SI"
          : "NO",

      Doc_DNI:
        audit.documentos?.dni
          ? "SI"
          : "NO",

      Doc_SCTR:
        audit.documentos?.sctr
          ? "SI"
          : "NO",

      Doc_Antecedentes_Penales:
        audit.documentos
          ?.antecedentesPenales
          ? "SI"
          : "NO",

      Doc_Antecedentes_Policiales:
        audit.documentos
          ?.antecedentesPoliciales
          ? "SI"
          : "NO",
    };
  });

  const worksheet =
    XLSX.utils.json_to_sheet(excelData);

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
    { wch: 22 },
    { wch: 14 },
    { wch: 20 },
    { wch: 26 },
    { wch: 18 },
    { wch: 18 },
    { wch: 14 },
    { wch: 18 },
    { wch: 18 },
    { wch: 20 },
    { wch: 18 },
    { wch: 20 },
    { wch: 10 },
    { wch: 16 },
    { wch: 22 },
    { wch: 35 },
    { wch: 18 },
    { wch: 18 },
    { wch: 10 },
    { wch: 16 },
    { wch: 12 },
    { wch: 12 },
    { wch: 14 },
    { wch: 30 },
    { wch: 32 },
  ];

  const workbook =
    XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "Auditoria"
  );

  XLSX.writeFile(
    workbook,
    `${fileName}.xlsx`
  );
}