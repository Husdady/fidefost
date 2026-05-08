// Utils
import openDatabase from "./openDatabase";

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

    // ID único REAL
    const id = crypto.randomUUID();

    const documentRecord = {
      id, 
      module,
      blob: file,
      name: file.name,
      size: file.size,
      type: file.type,
      relatedId,
      category: category || "general",
      lastModified: file.lastModified,
      createdAt: new Date().toISOString(),
    };

    const request = store.add(documentRecord);

    request.onsuccess = () => resolve(documentRecord);
    request.onerror = () => reject(request.error);
  });
}