// Utils
import openDatabase from "./openDatabase";

// Constants
import { STORE_NAME } from "./index";

/**
 * Callback for get documents by relation
 * @param {string} module Module
 * @param {string} relatedId Related ID
 */
export default async function getDocumentsByRelation(module, relatedId) {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const index = store.index("module_relatedId");

    const request = index.getAll([module, relatedId]);

    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
}
