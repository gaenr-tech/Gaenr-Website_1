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

const LOCAL_ONLY_KEYS = new Set([
  'gaenr_admin_logged',
  'gaenr_current_employee',
  'gaenr_admin_session',
  'gaenr_theme',
  'gaenr_device_theme',
]);

// Purge any legacy tombstone keys that blocked experts on client devices
try {
  nativeStorage.removeItem('gaenr_deleted_expert_codes');
  nativeStorage.removeItem('gaenr_freelancers_cleared');
} catch {}

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
    if (key && !LOCAL_ONLY_KEYS.has(key)) {
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

export const isPrivilegedWriter = (): boolean => {
  try {
    const isPathAdmin =
      typeof window !== 'undefined' &&
      (window.location.pathname.startsWith('/manage') ||
        window.location.pathname.startsWith('/admin') ||
        window.location.pathname.startsWith('/u/') ||
        window.location.pathname.startsWith('/p-upload/') ||
        window.location.pathname.startsWith('/expert-portfolio-upload/') ||
        window.location.hash.includes('manage') ||
        window.location.hash.includes('admin') ||
        window.location.hash.includes('/u/'));
    return (
      isPathAdmin ||
      nativeStorage.getItem('gaenr_admin_logged') === 'true' ||
      window.sessionStorage.getItem('gaenr_admin_logged') === 'true' ||
      window.sessionStorage.getItem('gaenr_admin_session') === 'active' ||
      nativeStorage.getItem('gaenr_admin_session') === 'active' ||
      Boolean(nativeStorage.getItem('gaenr_current_employee')) ||
      Boolean(window.sessionStorage.getItem('gaenr_current_employee'))
    );
  } catch {
    return false;
  }
};

export const getPendingCreatedExpertCodes = (): Set<string> => {
  try {
    const raw = nativeStorage.getItem('gaenr_pending_created_codes');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return new Set(parsed.map((c: string) => String(c).trim().toUpperCase()));
      }
    }
  } catch {}
  return new Set();
};

export const markExpertCodeAsPendingCreation = (code: string) => {
  try {
    const clean = code.trim().toUpperCase();
    const set = getPendingCreatedExpertCodes();
    set.add(clean);
    nativeStorage.setItem('gaenr_pending_created_codes', JSON.stringify(Array.from(set)));
  } catch {}
};

export const clearPendingCreatedExpertCode = (code: string) => {
  try {
    const clean = code.trim().toUpperCase();
    const set = getPendingCreatedExpertCodes();
    if (set.has(clean)) {
      set.delete(clean);
      nativeStorage.setItem('gaenr_pending_created_codes', JSON.stringify(Array.from(set)));
    }
  } catch {}
};

/**
 * Authoritative merge for experts:
 * Remote database state is the single source of truth.
 * Only local profiles that were explicitly created on this device and are awaiting sync
 * are preserved. All other profiles strictly mirror the remote database (preventing zombie resurrection).
 */
export const mergeFreelancersState = (
  localRaw: string | null,
  remoteRaw: string | null
): { mergedSerialized: string; shouldPushToRemote: boolean } => {
  let localList: any[] = [];
  try {
    const parsed = localRaw ? JSON.parse(localRaw) : [];
    if (Array.isArray(parsed)) localList = parsed;
  } catch {}

  let remoteList: any[] = [];
  try {
    const parsed = remoteRaw ? JSON.parse(remoteRaw) : [];
    if (Array.isArray(parsed)) remoteList = parsed;
  } catch {}

  const pendingCreated = getPendingCreatedExpertCodes();
  const map = new Map<string, any>();

  // 1. Remote items first (authoritative database state)
  remoteList.forEach((fl) => {
    const key = String(fl?.code || fl?.id || '').trim().toUpperCase();
    if (key) {
      map.set(key, fl);
      if (pendingCreated.has(key)) {
        clearPendingCreatedExpertCode(key);
      }
    }
  });

  // 2. Only preserve local items that were explicitly created locally and haven't synced yet
  let localHasNew = false;
  localList.forEach((fl) => {
    const key = String(fl?.code || fl?.id || '').trim().toUpperCase();
    if (key && !map.has(key) && pendingCreated.has(key)) {
      localHasNew = true;
      map.set(key, fl);
    }
  });

  const merged = Array.from(map.values());
  const mergedSerialized = JSON.stringify(merged);
  return { mergedSerialized, shouldPushToRemote: localHasNew };
};

export const deleteExpertFromRemote = async (code: string, updatedList?: any[]): Promise<boolean> => {
  try {
    const clean = code.trim().toUpperCase();
    const payload: Record<string, any> = {
      deletedExpertCodes: [clean],
    };
    if (Array.isArray(updatedList)) {
      payload.changes = {
        gaenr_freelancers: JSON.stringify(
          updatedList.filter((fl) => fl && fl.code && String(fl.code).trim().toUpperCase() !== clean)
        ),
      };
    }
    const res = await fetch(apiUrl(), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
      },
      body: JSON.stringify(payload),
    });
    return res.ok;
  } catch (err) {
    console.warn('[Gaenr] Delete expert failed:', err);
    return false;
  }
};

export const clearAllExpertsFromRemote = async (): Promise<boolean> => {
  try {
    const res = await fetch(apiUrl(), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
      },
      body: JSON.stringify({ clearFreelancers: true, changes: { gaenr_freelancers: '[]' } }),
    });
    return res.ok;
  } catch (err) {
    console.warn('[Gaenr] Clear all experts failed:', err);
    return false;
  }
};

export const syncKeyToRemote = async (key: string, value: string): Promise<boolean> => {
  if (LOCAL_ONLY_KEYS.has(key)) return false;
  pendingKeys.add(key);
  try {
    const body = JSON.stringify({ changes: { [key]: value } });
    const res = await fetch(apiUrl(), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
      },
      body,
    });
    return res.ok;
  } catch (err) {
    console.warn(`[Gaenr] Direct sync failed for ${key}:`, err);
    return false;
  } finally {
    setTimeout(() => pendingKeys.delete(key), 400);
  }
};

const queueRemoteMutation = (payload: { changes?: Record<string, string>; deletedKeys?: string[]; arrayChanges?: ArrayChange[] }) => {
  if (!hydrated) return;

  const targetKeys = [
    ...Object.keys(payload.changes || {}),
    ...(payload.deletedKeys || []),
    ...(payload.arrayChanges || []).map((change) => change.key),
  ];

  const GUEST_WRITABLE = new Set(['gaenr_tasks', 'gaenr_expert_applications', 'gaenr_feedbacks']);
  const isAllowed = isPrivilegedWriter() || (targetKeys.length > 0 && targetKeys.every((k) => GUEST_WRITABLE.has(k)));
  if (!isAllowed) return;

  const safeChanges: Record<string, string> = {};
  for (const [k, v] of Object.entries(payload.changes || {})) {
    if (!LOCAL_ONLY_KEYS.has(k)) safeChanges[k] = v;
  }
  const safeDeletedKeys = (payload.deletedKeys || []).filter((k) => !LOCAL_ONLY_KEYS.has(k));
  const safeArrayChanges = (payload.arrayChanges || []).filter((c) => !LOCAL_ONLY_KEYS.has(c.key));

  if (Object.keys(safeChanges).length === 0 && safeDeletedKeys.length === 0 && safeArrayChanges.length === 0) {
    return;
  }

  const cleanPayload = {
    changes: Object.keys(safeChanges).length > 0 ? safeChanges : undefined,
    deletedKeys: safeDeletedKeys.length > 0 ? safeDeletedKeys : undefined,
    arrayChanges: safeArrayChanges.length > 0 ? safeArrayChanges : undefined,
  };

  const affectedKeys = [
    ...Object.keys(cleanPayload.changes || {}),
    ...(cleanPayload.deletedKeys || []),
    ...(cleanPayload.arrayChanges || []).map((change) => change.key),
  ];
  affectedKeys.forEach((key) => pendingKeys.add(key));

  const body = JSON.stringify(cleanPayload);
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
      setTimeout(() => {
        affectedKeys.forEach((key) => pendingKeys.delete(key));
      }, 400);
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
      nativeSetItem.call(this, key, value);
      if (this !== nativeStorage || LOCAL_ONLY_KEYS.has(key)) return;

      // Do NOT auto-push gaenr_freelancers via monkey-patched setItem.
      // gaenr_freelancers is explicitly and intentionally synced via dedicated actions
      // (addFreelancer, updateFreelancer, deleteExpertFromRemote, clearAllExpertsFromRemote).
      if (key === 'gaenr_freelancers') return;

      queueRemoteMutation({ changes: { [key]: value } });
    },
  });

  Object.defineProperty(Storage.prototype, 'removeItem', {
    configurable: true,
    writable: true,
    value(this: Storage, key: string) {
      nativeRemoveItem.call(this, key);
      if (this === nativeStorage && !LOCAL_ONLY_KEYS.has(key)) {
        queueRemoteMutation({ deletedKeys: [key] });
      }
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
      if (LOCAL_ONLY_KEYS.has(key) || pendingKeys.has(key)) return;
      const value = serializeValue(rawValue);
      const previous = nativeStorage.getItem(key);

      // Strictly adopt authoritative remote state for experts (read-only; never pushes old local cache to server)
      if (key === 'gaenr_freelancers') {
        if (previous !== value) {
          nativeSetItem.call(nativeStorage, key, value);
          window.dispatchEvent(
            new StorageEvent('storage', {
              key,
              oldValue: previous,
              newValue: value,
              storageArea: nativeStorage,
            })
          );
        }
        return;
      }

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
        if (LOCAL_ONLY_KEYS.has(key)) return;
        const value = serializeValue(rawValue);
        const previous = nativeStorage.getItem(key);

        // Strictly adopt authoritative remote state for experts (read-only; never pushes old local cache to server)
        if (key === 'gaenr_freelancers') {
          nativeSetItem.call(nativeStorage, key, value);
          if (previous !== value) {
            window.dispatchEvent(
              new StorageEvent('storage', {
                key,
                oldValue: previous,
                newValue: value,
                storageArea: nativeStorage,
              })
            );
          }
          return;
        }

        nativeSetItem.call(nativeStorage, key, value);
        if (previous !== value) {
          window.dispatchEvent(
            new StorageEvent('storage', {
              key,
              oldValue: previous,
              newValue: value,
              storageArea: nativeStorage,
            })
          );
        }
      });
    } else if (isPrivilegedWriter()) {
      // One-time migration: only an authorized admin seeds the shared store.
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
