import { getStorage } from '../methods';
import { StatefulObject } from '../types';

export function disableStorageWrite<T extends object, TData>(proxy: StatefulObject<T>, callback: () => TData): TData {
  const storage = getStorage(proxy);

  const writeAccess = storage.writeAccess;
  storage.writeAccess = false;

  try {
    const result = callback();
    if (result instanceof Promise) {
      return (result
        .then((data) => {
          storage.writeAccess = writeAccess;
          return data;
        })
        .catch((err) => {
          storage.writeAccess = writeAccess;
          throw err;
        }) as any) as TData;
    }

    storage.writeAccess = writeAccess;
    return result;
  } catch (err) {
    storage.writeAccess = writeAccess;
    throw err;
  }
}
