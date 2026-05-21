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
          // UNIDAD
    MARCA: unit.marca,
    PLACA_UNIDAD: unit.placa,
    PLACA_TRACTOR: unit.placaTractor,
    PLACA_CARRETA: unit.placaCarreta,

    // MTC / PROPIEDAD
    MTC: unit.mtc,

    TARJETA_VEHICULAR:
      unit.tarjetaVehicularInfo,

    // REVISION
    F_VENCIMIENTO_REVISION_TECNICA:
      unit.revisionFecha,

    // SEGUROS
    SOAT: unit.soat,

    POLIZA_VEHICULAR: unit.polizaVehicular,

    POLIZAS_CARGA_CONTENEDOR: unit.polizaCarga,

    POLIZA_ENDOSO: unit.polizaEndoso,

    // CHECKS
    DOCUMENTACION_MTC:
      unit.documentos?.mtcCheck
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
        unit.documentos?.revisionTecnicaCheck 
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

let fileIndex = 1;

for (const document of unitDocuments) {

  const fileData =
    document.blob || document.file || document;

  if (!(fileData instanceof Blob)) {
    console.warn(
      "Archivo inválido:",
      document
    );

    continue;
  }

  const fileName =
    `${fileIndex}-${document.name || "archivo"}`;

  documentsFolder.file(
    fileName,
    fileData
  );

  fileIndex++;
}

// =========================
// ARCHIVOS SOAT / POLIZA
// =========================

for (const file of unit.archivos || []) {

  if (!file.insuranceFileId) {
    continue;
  }

  const insuranceDocument =
    await getDocumentById(
      file.insuranceFileId
    );

  const fileData =
    insuranceDocument?.blob ||
    insuranceDocument?.file;

  // VALIDAR
  if (
    !(fileData instanceof Blob)
  ) {
    console.warn(
      "Seguro inválido:",
      insuranceDocument
    );

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

  const insuranceFileName =
  `${fileIndex}-${insuranceDocument.name || "seguro"}`;

documentsFolder.file(
  insuranceFileName,
  fileData
);

fileIndex++;
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