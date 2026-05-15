import openDatabase from "./openDatabase";
import { STORE_NAME } from "./index";

export default async function getDocumentById(id) {

  const db = await openDatabase();

  return new Promise((resolve, reject) => {

    const transaction =
      db.transaction(STORE_NAME, "readonly");

    const store =
      transaction.objectStore(STORE_NAME);

    const request = store.get(id);

    request.onsuccess = () =>
      resolve(request.result);

    request.onerror = () =>
      reject(request.error);
  });
}