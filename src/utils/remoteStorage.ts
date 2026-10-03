const API_PATH = '/api/state';
const nativeStorage = window.localStorage;
const nativeSetItem = Storage.prototype.setItem;
const nativeRemoveItem = Storage.prototype.removeItem;
let hydrated = false;
let writeQueue = Promise.resolve();
let mirrorInstalled = false;

const apiUrl = () => {
  const configured = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
  return `${configured}${API_PATH}`;
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

const queueRemoteMutation = (payload: { changes?: Record<string, string>; deletedKeys?: string[] }) => {
  if (!hydrated) return;
  writeQueue = writeQueue
    .catch(() => undefined)
    .then(() => fetch(apiUrl(), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true,
    }))
    .then((response) => {
      if (!response.ok) throw new Error(`Remote storage write failed: ${response.status}`);
    })
    .catch(() => {
      // Keep the local copy available when the self-hosted API is temporarily offline.
    });
};

const installMirror = () => {
  if (mirrorInstalled) return;
  mirrorInstalled = true;

  Object.defineProperty(Storage.prototype, 'setItem', {
    configurable: true,
    writable: true,
    value(this: Storage, key: string, value: string) {
      nativeSetItem.call(this, key, value);
      if (this === nativeStorage) queueRemoteMutation({ changes: { [key]: value } });
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

export const initializeRemoteStorage = async () => {
  installMirror();
  try {
    const response = await fetch(apiUrl(), { headers: { Accept: 'application/json' } });
    if (!response.ok) throw new Error(`Remote storage unavailable: ${response.status}`);
    const database = await response.json() as { state?: Record<string, string> };
    const remoteState = database.state && typeof database.state === 'object' ? database.state : {};

    if (Object.keys(remoteState).length > 0) {
      Object.entries(remoteState).forEach(([key, value]) => nativeSetItem.call(nativeStorage, key, value));
    } else {
      // One-time migration: the first browser seeds the shared store from its local data.
      await fetch(apiUrl(), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ state: snapshot() }),
      });
    }
  } catch (error) {
    // A local/offline development session still works with the existing localStorage copy.
    console.error('[Gaenr] Shared backend unavailable; using local fallback.', error);
  } finally {
    hydrated = true;
  }
};
