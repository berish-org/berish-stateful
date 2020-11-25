import { StatefulObject } from '../types';
import { getStorage } from './getStorage';

export async function loadStorage<T extends object>(proxy: StatefulObject<T>) {
  const storage = getStorage(proxy);
  if (storage) {
    const state = await storage.load();
    const entries = state && Object.entries<any>(state);
    if (entries && entries.length) {
      const writeAccess = storage.writeAccess;
      storage.writeAccess = false;
      for (const [key, value] of entries) {
        proxy[key] = value;
      }
      storage.writeAccess = writeAccess;
    }
  }
}
