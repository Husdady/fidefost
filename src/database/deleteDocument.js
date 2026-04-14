// Utils
import openDatabase from "./openDatabase";

// Constants
import { STORE_NAME } from "./index";

/**
 * Callback to delete document
 * @param {string} documentId Document ID
 */
export async function deleteDocument(documentId) {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);

    const request = store.delete(documentId);

    request.onsuccess = () => resolve(true);
    request.onerror = () => reject(request.error);
  });
}
