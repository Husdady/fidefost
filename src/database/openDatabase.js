// Constants
import { DB_NAME, DB_VERSION, STORE_NAME } from "database";

/**
 * Callback to open database from IndexedDB
 */
export default function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);

    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = () => {
      const db = request.result;

      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: "id" });
        store.createIndex("module", "module", { unique: false });
        store.createIndex("relatedId", "relatedId", { unique: false });

        store.createIndex("module_relatedId", ["module", "relatedId"], {
          unique: false,
        });
      }
    };
  });
}
