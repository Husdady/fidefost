import JSZip from "jszip";
import { saveAs } from "file-saver";

import getDocumentsByRelation from "database/getDocumentsByRelation";
import getDocumentById from "database/getDocumentById";

export default async function exportUnitZip(
  unit,
  insuranceContracts = []
) {
  const zip = new JSZip();

  const documentsFolder =
    zip.folder("DOCUMENTOS");

  const unitDocuments =
    await getDocumentsByRelation(
      "units",
      unit._id
    );

  let fileIndex = 1;

  for (const document of unitDocuments) {
    const fileData =
      document.blob ||
      document.file ||
      document;

    if (!(fileData instanceof Blob)) {
      console.warn(
        "Archivo inválido:",
        document
      );

      continue;
    }

    const fileName =
      `${fileIndex}-${
        document.name || "archivo"
      }`;

    documentsFolder.file(
      fileName,
      fileData
    );

    fileIndex++;
  }

  const insuranceFiles = [];
    // POLIZA VEHICULAR
  const vehicularInsurance =
    insuranceContracts.find(
      (item) =>
        item.poliza === unit.polizaVehicular
    );

  if (vehicularInsurance?.archivos) {
    insuranceFiles.push(
      ...vehicularInsurance.archivos
    );
  }
   // POLIZA CARGA
  const cargaInsurance =
    insuranceContracts.find(
      (item) =>
        item.poliza === unit.polizaCarga
    );

  if (cargaInsurance?.archivos) {
    insuranceFiles.push(
      ...cargaInsurance.archivos
    );
  }
// POLIZA ENDOSO
  const endosoInsurance =
    insuranceContracts.find(
      (item) =>
        item.poliza === unit.polizaEndoso
    );

  if (endosoInsurance?.archivos) {
    insuranceFiles.push(
      ...endosoInsurance.archivos
    );
  }
    // SOAT
  const soatInsurance =
    insuranceContracts.find(
      (item) =>
        item.poliza === unit.soat
    );

  if (soatInsurance?.archivos) {
    insuranceFiles.push(
      ...soatInsurance.archivos
    );
  }

  const addedFiles = new Set();

  for (const file of insuranceFiles) {
    const insuranceDocument =
      await getDocumentById(
        file.id || file.insuranceFileId
      );

    if (!insuranceDocument) {
      continue;
    }

    const fileData =
      insuranceDocument.blob ||
      insuranceDocument.file;

    if (!(fileData instanceof Blob)) {
      continue;
    }

    const uniqueKey =
      insuranceDocument.id ||
      insuranceDocument.name;

    if (addedFiles.has(uniqueKey)) {
      continue;
    }

    addedFiles.add(uniqueKey);

    const insuranceFileName =
      `${fileIndex}-${
        insuranceDocument.name || "seguro"
      }`;

    documentsFolder.file(
      insuranceFileName,
      fileData
    );

    fileIndex++;
  }

  const content =
    await zip.generateAsync({
      type: "blob",
    });

  saveAs(
    content,
    `DOCUMENTOS-${unit.placaTractor}-${unit.placaCarreta}.zip`
  );
}