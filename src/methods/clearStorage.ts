import { StatefulObject } from '../types';
import { getStorage } from './getStorage';

export async function clearStorage<T extends object>(proxy: StatefulObject<T>) {
  const storage = getStorage(proxy);
  if (storage) await storage.clear();
}
