import { IDBPDatabase, openDB } from 'idb';

let db: IDBPDatabase;
let table = 'metadata'; // currently using indexedDB for storing metadata
async function initDB() {
  if (typeof window !== 'undefined') {
    db = await openDB('metadata', 1, {
      upgrade(db) {
        db.createObjectStore('metadata', {
          keyPath: 'id',
          autoIncrement: true,
        });
      },
    });
  }
}

initDB();

async function setItemToIndexedDB(key: string, value: any) {
  if (!db) {
    await initDB();
  }
  const tx = db.transaction(table, 'readwrite');
  const store = tx.objectStore(table);
  await store.put({ id: key, value });
  await tx.done;
}

async function getItemFromIndexedDB(key: string) {
  if (!db) {
    await initDB();
  }
  return (await db.get(table, key))?.value;
}
async function deleteItemFromIndexedDB(key: string) {
  if (!db) {
    await initDB();
  }
  const tx = db.transaction(table, 'readwrite');
  const store = tx.objectStore(table);
  await store.delete(key);
  await tx.done;
}
async function clearIndexedDB() {
  if (!db) {
    await initDB();
  }
  const tx = db.transaction(table, 'readwrite');
  const store = tx.objectStore(table);
  await store.clear();
  await tx.done;
}
export {
  setItemToIndexedDB,
  getItemFromIndexedDB,
  deleteItemFromIndexedDB,
  clearIndexedDB,
};
