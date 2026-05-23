import JSZip from "jszip";

import { saveAs } from "file-saver";

export default async function downloadInsuranceZip(
  insurance
) {

  const zip = new JSZip();

  const folder =
    zip.folder("documentos");

  insurance.archivos.forEach(
    (doc, index) => {

      if (doc?.blob) {

        folder.file(
          `${index + 1}-${doc.name}`,
          doc.blob
        );

      }

    }
  );

  const content =
    await zip.generateAsync({
      type: "blob",
    });

  saveAs(
    content,
    `SE-${insurance.poliza}.zip`
  );
}