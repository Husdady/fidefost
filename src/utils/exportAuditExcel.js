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

    return {
      
        Operador:
          audit.operador,

        Conductor:
          audit.auditDriver,

        Licencia:
          audit.auditLicense,
        
        Fecha_Vencimiento:
          audit.auditLicenseExpiration,

        Induccion:
          audit.auditInductionStatus,

        Fecha_Aprobacion_Induccion:
          audit.auditInductionDate,

        Inicio_Contrato:
          audit.auditContract?.start,

        Fin_Contrato:
          audit.auditContract?.end,

        Dias_Activos:
          audit.auditContract?.days,
        
        Estado:
          audit.auditOperationalStatus,
        
        GPS:
          audit.gps ? "SI" : "NO",
        
        ID_GPS:
          audit.gpsId,
        
        Proveedor_GPS:
          gpsData?.provider || "",

        Link_GPS:
          gpsData?.gpsLink || "",

        Wifi:
          audit.wifi ? "SI" : "NO",
        
        Check_Doc_Brevete:
          audit.documentos?.brevete ? "SI" : "NO",
        
        Check_Doc_DNI:
          audit.documentos?.dni ? "SI" : "NO",

        Check_Doc_SCTR:
          audit.documentos?.sctr ? "SI" : "NO",
        
        Check_Doc_Antecedentes_Penales:
          audit.documentos?.antecedentesPenales ? "SI" : "NO",
          
        Check_Doc_Antecedentes_Policiales:
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