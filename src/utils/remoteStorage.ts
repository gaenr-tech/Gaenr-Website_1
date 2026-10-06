type ArrayChange = {
  key: string;
  upserts: unknown[];
  deletes: unknown[];
};

const API_PATH = '/api/state';
const nativeStorage = window.localStorage;
const nativeSetItem = Storage.prototype.setItem;
const nativeRemoveItem = Storage.prototype.removeItem;
let hydrated = false;
let writeQueue = Promise.resolve();
let mirrorInstalled = false;
let syncTimer: number | undefined;
const pendingKeys = new Set<string>();

const apiUrl = () => {
  const configured = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
  return `${configured}${API_PATH}`;
};

const getApiUrlWithCacheBust = () => {
  const base = apiUrl();
  const sep = base.includes('?') ? '&' : '?';
  return `${base}${sep}_t=${Date.now()}`;
};

const serializeValue = (val: unknown): string => {
  if (typeof val === 'string') return val;
  if (val === null || val === undefined) return '';
  return JSON.stringify(val);
};

const snapshot = () => {
  const state: Record<string, string> = {};
  for (let index = 0; index < nativeStorage.length; index += 1) {
    const key = nativeStorage.key(index);
    if (key) {
      const value = nativeStorage.getItem(key);
      if (value !== null) state[key] = value;
    }
  }
  return state;
};

const parseArray = (value: string | null): unknown[] | null => {
  if (!value) return null;
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
};

const identity = (item: unknown) => {
  if (item && typeof item === 'object') {
    const record = item as Record<string, unknown>;
    if (typeof record.code === 'string' && record.code) return `code:${record.code}`;
    if (typeof record.id === 'string' && record.id) return `id:${record.id}`;
  }
  return `value:${JSON.stringify(item)}`;
};

const diffArray = (previous: unknown[], next: unknown[]): ArrayChange | null => {
  const previousMap = new Map(previous.map((item) => [identity(item), item]));
  const nextMap = new Map(next.map((item) => [identity(item), item]));
  const upserts = next.filter((item) => {
    const old = previousMap.get(identity(item));
    return old === undefined || JSON.stringify(old) !== JSON.stringify(item);
  });
  const deletes = previous.filter((item) => !nextMap.has(identity(item)));
  if (upserts.length === 0 && deletes.length === 0) return null;
  return { key: '', upserts, deletes };
};

const queueRemoteMutation = (payload: { changes?: Record<string, string>; deletedKeys?: string[]; arrayChanges?: ArrayChange[] }) => {
  if (!hydrated) return;
  const keys = [
    ...Object.keys(payload.changes || {}),
    ...(payload.deletedKeys || []),
    ...(payload.arrayChanges || []).map((change) => change.key),
  ];
  keys.forEach((key) => pendingKeys.add(key));

  const body = JSON.stringify(payload);
  const options: RequestInit = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
    },
    body,
  };
  if (body.length < 60000) {
    options.keepalive = true;
  }

  writeQueue = writeQueue
    .catch(() => undefined)
    .then(() => fetch(apiUrl(), options))
    .then((response) => {
      if (!response.ok) throw new Error(`Remote storage write failed: ${response.status}`);
      keys.forEach((key) => pendingKeys.delete(key));
    })
    .catch((err) => {
      console.warn('[Gaenr] Remote storage mutation pending retry/offline:', err);
    });
};

const installMirror = () => {
  if (mirrorInstalled) return;
  mirrorInstalled = true;

  Object.defineProperty(Storage.prototype, 'setItem', {
    configurable: true,
    writable: true,
    value(this: Storage, key: string, value: string) {
      const previous = this === nativeStorage ? this.getItem(key) : null;
      nativeSetItem.call(this, key, value);
      if (this !== nativeStorage) return;

      const previousArray = parseArray(previous);
      const nextArray = parseArray(value);
      if (nextArray) {
        const arrayChange = diffArray(previousArray || [], nextArray);
        if (arrayChange) queueRemoteMutation({ arrayChanges: [{ ...arrayChange, key }] });
        return;
      }
      queueRemoteMutation({ changes: { [key]: value } });
    },
  });

  Object.defineProperty(Storage.prototype, 'removeItem', {
    configurable: true,
    writable: true,
    value(this: Storage, key: string) {
      nativeRemoveItem.call(this, key);
      if (this === nativeStorage) queueRemoteMutation({ deletedKeys: [key] });
    },
  });
};

const refreshRemoteStorage = async () => {
  if (!hydrated || document.visibilityState === 'hidden') return;
  try {
    const response = await fetch(getApiUrlWithCacheBust(), {
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    });
    if (!response.ok) return;
    const database = await response.json() as { state?: Record<string, unknown> };
    const remoteState = database.state && typeof database.state === 'object' ? database.state : {};
    Object.entries(remoteState).forEach(([key, rawValue]) => {
      if (pendingKeys.has(key)) return;
      const value = serializeValue(rawValue);
      const previous = nativeStorage.getItem(key);
      if (previous === value) return;
      nativeSetItem.call(nativeStorage, key, value);
      window.dispatchEvent(new StorageEvent('storage', { key, oldValue: previous, newValue: value, storageArea: nativeStorage }));
    });
  } catch {
    // A temporary polling failure must not interrupt the app.
  }
};

export const initializeRemoteStorage = async () => {
  installMirror();
  try {
    const response = await fetch(getApiUrlWithCacheBust(), {
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    });
    if (!response.ok) throw new Error(`Remote storage unavailable: ${response.status}`);
    const database = await response.json() as { state?: Record<string, unknown> };
    const remoteState = database.state && typeof database.state === 'object' ? database.state : {};

    if (Object.keys(remoteState).length > 0) {
      Object.entries(remoteState).forEach(([key, rawValue]) => {
        const value = serializeValue(rawValue);
        nativeSetItem.call(nativeStorage, key, value);
      });
    } else {
      // One-time migration: the first browser seeds the shared store from its local data.
      await fetch(apiUrl(), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ state: snapshot() }),
      });
    }
  } catch (error) {
    console.error('[Gaenr] Shared backend unavailable; using local fallback.', error);
  } finally {
    hydrated = true;
    if (syncTimer === undefined) {
      syncTimer = window.setInterval(refreshRemoteStorage, 5000);
      window.addEventListener('focus', refreshRemoteStorage);
      window.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
          refreshRemoteStorage();
        }
      });
    }
  }
};
