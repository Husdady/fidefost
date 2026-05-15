import JSZip from "jszip";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import getDocumentsByRelation from "database/getDocumentsByRelation";
import getDocumentById from "database/getDocumentById";

export default async function exportUnitZip(unit) {

  const zip = new JSZip();

  // =========================
  // EXCEL DATA
  // =========================

  const data = [
    {
      PLACA: unit.placa,
      MARCA: unit.marca,

      MTC: unit.mtc,

      TARJETA_VEHICULAR:
        unit.tarjetaVehicularInfo,

      F_VENCIMIENTO_REVISION_TECNICA:
        unit.revisionFecha,

      SOAT: unit.soat,

      POLIZA: unit.poliza,

      PARTIDA: unit.partida,

      DOCUMENTACION_MTC:
      unit.documentos?.mtcCheck
        ? "SI"
        : "NO",

        DOCUMENTACION_SOAT:
        unit.documentos?.soatCheck
            ? "SI"
            : "NO",

        DOCUMENTACION_POLIZA:
        unit.documentos?.polizaCheck
            ? "SI"
            : "NO",

        DOCUMENTACION_TARJETA_VEHICULAR:
        unit.documentos?.tarjetaVehicularCheck
            ? "SI"
            : "NO",
        DOCUMENTACION_REC_TECN_TRACTOR_BAL_929:
            unit.documentos?.recTecnTractorCheck 
            ? "SI"
            : "NO",
        DOCUMENTACION_REC_TECN_TRACTOR_BAL_C3E_970:
            unit.documentos?.recTecnCarretaCheck 
            ? "SI"
            : "NO",
        DOCUMENTACION_PERMISO_MUNICIPAL:
            unit.documentos?.permisoMunicipalCheck
            ? "SI"
            : "NO",
    }
  ];

  // =========================
  // EXCEL
  // =========================

  const worksheet =
    XLSX.utils.json_to_sheet(data);

  const workbook =
    XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "UNIDAD"
  );

  const excelBuffer =
    XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

  // AGREGAR EXCEL AL ZIP
  zip.file(
    `UNIDAD-${unit.placa}.xlsx`,
    excelBuffer
  );

  // =========================
  // ARCHIVOS INDEXEDDB
  // =========================

  const documentsFolder =
    zip.folder("DOCUMENTOS");

// =========================
// ARCHIVOS MANUALES UNIDAD
// =========================

const unitDocuments =
  await getDocumentsByRelation(
    "units",
    unit._id
  );

for (const document of unitDocuments) {

  if (!document.blob) {
    continue;
  }

  documentsFolder.file(
    document.name,
    document.blob
  );
}

// =========================
// ARCHIVOS SOAT / POLIZA
// =========================

for (const file of unit.archivos || []) {

  // SOLO archivos referenciados
  if (!file.insuranceFileId) {
    continue;
  }

  const insuranceDocument =
    await getDocumentById(
      file.insuranceFileId
    );

  if (!insuranceDocument?.blob) {
    continue;
  }

  // EVITAR DUPLICADOS
  if (
    documentsFolder.files[
      insuranceDocument.name
    ]
  ) {
    continue;
  }

  documentsFolder.file(
    insuranceDocument.name,
    insuranceDocument.blob
  );
}


  // =========================
  // GENERAR ZIP
  // =========================

  const content =
    await zip.generateAsync({
      type: "blob",
    });

  saveAs(
    content,
    `UNIDAD-${unit.placa}.zip`
  );
}