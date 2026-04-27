// Utils
import openDatabase from "./openDatabase";
import generateId from "utils/generateId";

// Constants
import { STORE_NAME } from "./index";

/**
 * Callback to save document
 * @param {object} params Params
 */
export default async function saveDocument({
  file,
  module,
  relatedId,
  category,
}) {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);

    const documentRecord = {
      module,
      file: file,
      name: file.name,
      size: file.size,
      type: file.type,
      relatedId: relatedId,
      id: file._id || generateId(),
      category: category || "general",
      lastModified: file.lastModified,
      createdAt: new Date().toISOString(),
    };

    const request = store.add(documentRecord);

    request.onsuccess = () => resolve(documentRecord);
    request.onerror = () => reject(request.error);
  });
}
