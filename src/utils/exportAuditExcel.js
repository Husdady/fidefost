import * as XLSX from "xlsx";
import useGpsContractsStore from "context/contracts/gpsContractsStore";

export default function exportAuditExcel(data, fileName = "auditoria") {
  const arrayData =
    Array.isArray(data)
      ? data
      : [data];

  const gpsContracts =
  useGpsContractsStore.getState()
    .gpsContracts;

  const excelData = arrayData.map((audit) => {

  const gpsData =
      gpsContracts.find(
        (gps) =>
          gps.id === audit.gpsId
      );
  
  //format date
  const formatDate = (dateString) => {

        if (!dateString) {
          return "-";
        }

        const [year, month, day] =
          dateString.split("-");

        return `${day}/${month}/${year}`;
      };

    return {

        Conductor:
          audit.auditDriver,

        Licencia:
          audit.auditLicense,
        
        Fecha_Vencimiento:
          formatDate(audit.auditLicenseExpiration),

        Inducciones:
          audit.auditInductions,

        Inicio_Contrato:
          formatDate(audit.auditContract?.start),

        Fin_Contrato:
          formatDate(audit.auditContract?.end),

        Dias_Activos:
          audit.auditContract?.days,
        
        Estado:
          audit.auditOperationalStatus,
        
        Placa_Tractor:
          audit.auditUnidad?.placaTractor,

        Placa_Carreta:
          audit.auditUnidad?.placaCarreta,
        
        Marca:
          audit.auditUnidad?.marca,

        GPS:
          audit.gps ? "SI" : "NO",
        
        ID_GPS:
          audit.gpsId || "-",
        
        Proveedor_GPS:
          gpsData?.provider || "-",

        Link_GPS:
          gpsData?.gpsLink || "-",

        FI_CONTRATO:
          formatDate(gpsData?.installationDate || ""),
        
        FV_CONTRATO:
          formatDate(gpsData?.endDate || ""),

        Wifi:
          audit.wifi ? "SI" : "NO",
        
        Doc_Brevete:
          audit.documentos?.brevete ? "SI" : "NO",
        
        Doc_DNI:
          audit.documentos?.dni ? "SI" : "NO",

        Doc_SCTR:
          audit.documentos?.sctr ? "SI" : "NO",
        
        Doc_Antecedentes_Penales:
          audit.documentos?.antecedentesPenales ? "SI" : "NO",
          
        Doc_Antecedentes_Policiales:
          audit.documentos?.antecedentesPoliciales ? "SI" : "NO",
      };
});

  const worksheet =
    XLSX.utils.json_to_sheet(excelData);

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