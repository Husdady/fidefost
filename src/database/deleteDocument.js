import openDatabase from "./openDatabase";

// Constants
import { STORE_NAME } from "./index";

export default async function deleteDocument(id) {

  if (!id) {
    return;
  }

  const db = await openDatabase();

  return new Promise((resolve, reject) => {

    const transaction =
      db.transaction(STORE_NAME, "readwrite");

    const store =
      transaction.objectStore(STORE_NAME);

    const request = store.delete(id);

    request.onsuccess = () => resolve(true);

    request.onerror = () =>
      reject(request.error);
  });
}