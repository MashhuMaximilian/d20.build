"use client";

import type {
  CachedSourceSummary,
  ContentSource,
  ImportedElement,
  ImportedSourceFile,
} from "@/lib/content-sources/types";

const DATABASE_NAME = "arcanum-content-cache";
const DATABASE_VERSION = 1;
const SOURCE_SUMMARY_STORE = "source_summaries";
const SOURCE_FILE_STORE = "source_files";
const SOURCE_ELEMENT_STORE = "source_elements";

type CachedSourceFileRecord = ImportedSourceFile & {
  sourceId: string;
};

type CachedSourceElementRecord = ImportedElement & {
  sourceId: string;
};

function canUseIndexedDb() {
  return typeof window !== "undefined" && typeof window.indexedDB !== "undefined";
}

function openCacheDatabase() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    if (!canUseIndexedDb()) {
      reject(new Error("IndexedDB is not available in this browser."));
      return;
    }

    const request = window.indexedDB.open(DATABASE_NAME, DATABASE_VERSION);

    request.onerror = () => reject(request.error ?? new Error("Failed to open IndexedDB."));
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = () => {
      const database = request.result;

      if (!database.objectStoreNames.contains(SOURCE_SUMMARY_STORE)) {
        database.createObjectStore(SOURCE_SUMMARY_STORE, { keyPath: "sourceId" });
      }

      if (!database.objectStoreNames.contains(SOURCE_FILE_STORE)) {
        const store = database.createObjectStore(SOURCE_FILE_STORE, {
          keyPath: ["sourceId", "file_url"],
        });
        store.createIndex("by_source_id", "sourceId", { unique: false });
      }

      if (!database.objectStoreNames.contains(SOURCE_ELEMENT_STORE)) {
        const store = database.createObjectStore(SOURCE_ELEMENT_STORE, {
          keyPath: ["sourceId", "element_id"],
        });
        store.createIndex("by_source_id", "sourceId", { unique: false });
      }
    };
  });
}

function requestToPromise<T>(request: IDBRequest<T>) {
  return new Promise<T>((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("IndexedDB request failed."));
  });
}

function transactionDone(transaction: IDBTransaction) {
  return new Promise<void>((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = () =>
      reject(transaction.error ?? new Error("IndexedDB transaction failed."));
    transaction.onabort = () =>
      reject(transaction.error ?? new Error("IndexedDB transaction aborted."));
  });
}

async function deleteBySourceId(
  transaction: IDBTransaction,
  storeName: string,
  sourceId: string,
) {
  const store = transaction.objectStore(storeName);
  const index = store.index("by_source_id");
  const keyRange = IDBKeyRange.only(sourceId);
  const records = (await requestToPromise(index.getAllKeys(keyRange))) as IDBValidKey[];

  await Promise.all(records.map((key) => requestToPromise(store.delete(key))));
}

export async function replaceCachedSourceData(input: {
  source: ContentSource;
  files: ImportedSourceFile[];
  elements: ImportedElement[];
}) {
  const database = await openCacheDatabase();
  const transaction = database.transaction(
    [SOURCE_SUMMARY_STORE, SOURCE_FILE_STORE, SOURCE_ELEMENT_STORE],
    "readwrite",
  );

  const summaryStore = transaction.objectStore(SOURCE_SUMMARY_STORE);
  const fileStore = transaction.objectStore(SOURCE_FILE_STORE);
  const elementStore = transaction.objectStore(SOURCE_ELEMENT_STORE);
  const cachedAt = new Date().toISOString();

  await deleteBySourceId(transaction, SOURCE_FILE_STORE, input.source.id);
  await deleteBySourceId(transaction, SOURCE_ELEMENT_STORE, input.source.id);

  summaryStore.put({
    sourceId: input.source.id,
    sourceName: input.source.name,
    indexUrl: input.source.index_url,
    sourceKind: input.source.source_kind,
    cachedAt,
    sourceUpdatedAt: input.source.updated_at,
    remoteLastSyncedAt: input.source.last_synced_at,
    fileCount: input.files.length,
    elementCount: input.elements.length,
  } satisfies CachedSourceSummary);

  input.files.forEach((file) => {
    fileStore.put({
      ...file,
      sourceId: input.source.id,
    } satisfies CachedSourceFileRecord);
  });

  input.elements.forEach((element) => {
    elementStore.put({
      ...element,
      sourceId: input.source.id,
    } satisfies CachedSourceElementRecord);
  });

  await transactionDone(transaction);
  database.close();
}

export async function getCachedSourceSummary(sourceId: string) {
  const database = await openCacheDatabase();
  const transaction = database.transaction([SOURCE_SUMMARY_STORE], "readonly");
  const store = transaction.objectStore(SOURCE_SUMMARY_STORE);
  const summary = await requestToPromise<CachedSourceSummary | undefined>(store.get(sourceId));
  database.close();
  return summary ?? null;
}

export async function listCachedSourceSummaries() {
  const database = await openCacheDatabase();
  const transaction = database.transaction([SOURCE_SUMMARY_STORE], "readonly");
  const store = transaction.objectStore(SOURCE_SUMMARY_STORE);
  const summaries = await requestToPromise<CachedSourceSummary[]>(store.getAll());
  database.close();
  return summaries;
}

export async function listCachedElements() {
  const database = await openCacheDatabase();
  const transaction = database.transaction([SOURCE_ELEMENT_STORE], "readonly");
  const store = transaction.objectStore(SOURCE_ELEMENT_STORE);
  const elements = await requestToPromise<CachedSourceElementRecord[]>(store.getAll());
  database.close();
  return elements;
}

export async function removeCachedSourceData(sourceId: string) {
  const database = await openCacheDatabase();
  const transaction = database.transaction(
    [SOURCE_SUMMARY_STORE, SOURCE_FILE_STORE, SOURCE_ELEMENT_STORE],
    "readwrite",
  );

  transaction.objectStore(SOURCE_SUMMARY_STORE).delete(sourceId);
  await deleteBySourceId(transaction, SOURCE_FILE_STORE, sourceId);
  await deleteBySourceId(transaction, SOURCE_ELEMENT_STORE, sourceId);

  await transactionDone(transaction);
  database.close();
}
