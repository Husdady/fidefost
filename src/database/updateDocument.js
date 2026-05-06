import openDatabase from "./openDatabase";
import { STORE_NAME } from "./index";

export default async function updateDocument(documentRecord) {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);

    const request = store.put(documentRecord);

    request.onsuccess = () => resolve(documentRecord);
    request.onerror = () => reject(request.error);
  });
}