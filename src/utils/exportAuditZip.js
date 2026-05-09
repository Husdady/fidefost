import * as XLSX from "xlsx";

import JSZip from "jszip";

import { saveAs } from "file-saver";
import getDocumentsByRelation from "database/getDocumentsByRelation";

export default async function exportAuditZip(
  audit
) {

  const zip = new JSZip();

  // ==========
  // EXCEL
  // ==========

  const excelData = [{

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

    Wifi:
      audit.wifi ? "SI" : "NO",

    GPS:
      audit.gps ? "SI" : "NO",
    
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

  
    documents.forEach((doc) => {

    if (doc.blob) {

        zip.file(
        doc.name,
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