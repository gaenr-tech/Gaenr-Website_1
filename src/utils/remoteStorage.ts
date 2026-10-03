const API_PATH = '/api/state';
const nativeStorage = window.localStorage;
const nativeSetItem = nativeStorage.setItem.bind(nativeStorage);
const nativeRemoveItem = nativeStorage.removeItem.bind(nativeStorage);
let hydrated = false;
let writeQueue = Promise.resolve();

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
  nativeStorage.setItem = ((key: string, value: string) => {
    nativeSetItem(key, value);
    queueRemoteMutation({ changes: { [key]: value } });
  }) as Storage['setItem'];
  nativeStorage.removeItem = ((key: string) => {
    nativeRemoveItem(key);
    queueRemoteMutation({ deletedKeys: [key] });
  }) as Storage['removeItem'];
};

export const initializeRemoteStorage = async () => {
  installMirror();
  try {
    const response = await fetch(apiUrl(), { headers: { Accept: 'application/json' } });
    if (!response.ok) throw new Error(`Remote storage unavailable: ${response.status}`);
    const database = await response.json() as { state?: Record<string, string> };
    const remoteState = database.state && typeof database.state === 'object' ? database.state : {};

    if (Object.keys(remoteState).length > 0) {
      Object.entries(remoteState).forEach(([key, value]) => nativeSetItem(key, value));
    } else {
      // One-time migration: the first browser seeds the shared store from its local data.
      await fetch(apiUrl(), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ state: snapshot() }),
      });
    }
  } catch {
    // A local/offline development session still works with the existing localStorage copy.
  } finally {
    hydrated = true;
  }
};
