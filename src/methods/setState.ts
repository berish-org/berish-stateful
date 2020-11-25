import LINQ from '@berish/linq';
import { StatefulObject } from '../types';
import { getScope } from './getScope';
import { getStorage } from './getStorage';

export function setState<T extends object>(proxy: StatefulObject<T>, state: Partial<T>, notEmitStorage: boolean) {
  const scope = getScope(proxy);
  const storage = getStorage(proxy);
  const oldKeys = Object.keys(scope.target);

  const newKeys = (state && typeof state === 'object' && Object.keys(state)) || [];
  if (newKeys && newKeys.length > 0) {
    const writeAccess = storage.writeAccess;
    if (!notEmitStorage) storage.writeAccess = false;

    for (const key of newKeys) {
      proxy[key] = state[key];
    }

    if (!notEmitStorage) storage.writeAccess = writeAccess;
  }

  const deleteKeys = LINQ.from(oldKeys).except(newKeys);
  if (deleteKeys && deleteKeys.length > 0) {
    const writeAccess = storage.writeAccess;
    if (!notEmitStorage) storage.writeAccess = false;

    for (const key of deleteKeys) {
      proxy[key] = undefined;
    }

    if (!notEmitStorage) storage.writeAccess = writeAccess;
  }
}
