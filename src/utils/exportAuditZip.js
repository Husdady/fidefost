import * as XLSX from "xlsx";

import JSZip from "jszip";

import { saveAs } from "file-saver";
import getDocumentsByRelation from "database/getDocumentsByRelation";
import useGpsContractsStore from "context/contracts/gpsContractsStore";

export default async function exportAuditZip(
  audit
) {

  const zip = new JSZip();

  // ==========
  // EXCEL
  // ==========
  const gpsContracts =
  useGpsContractsStore.getState()
    .gpsContracts;
  
  const gpsData =
  gpsContracts.find(
    (gps) =>
      gps.id === audit.gpsId
  );

  const excelData = [{

        Conductor:
          audit.auditDriver,

        Licencia:
          audit.auditLicense,
        
        Fecha_Vencimiento:
          audit.auditLicenseExpiration,

        Inducciones:
          audit.auditInductions,

        Inicio_Contrato:
          audit.auditContract?.start,

        Fin_Contrato:
          audit.auditContract?.end,

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
          audit.gpsId,
        
        Proveedor_GPS:
          gpsData?.provider || "",

        Link_GPS:
          gpsData?.gpsLink || "",
        
        FI_CONTRATO:
          gpsData?.installationDate || "",
        
        FV_CONTRATO:
          gpsData?.endDate || "",

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

  }];

  const worksheet =
    XLSX.utils.json_to_sheet(excelData);

  const workbook =
    XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "Auditoria"
  );

  const excelBuffer =
    XLSX.write(
      workbook,
      {
        bookType: "xlsx",
        type: "array",
      }
    );

  zip.file(
    `AU-${audit.auditDriver}.xlsx`,
    excelBuffer
  );

  // ==========
  // ARCHIVOS INDEXEDDB
  // ==========

const documents =
  await getDocumentsByRelation(
    "contracts",
    audit._id
  );

  
    const documentsFolder =
  zip.folder("documentos");

documents.forEach((doc, i) => {

  if (doc?.blob) {

    documentsFolder.file(
      `${i + 1}-${doc.name}`,
      doc.blob
    );

  }

});

  // ==========
  // GENERAR ZIP
  // ==========

  const content =
    await zip.generateAsync({
      type: "blob",
    });

  saveAs(
    content,
    `AU-${audit.auditDriver}.zip`
  );
}