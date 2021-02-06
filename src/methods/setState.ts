import LINQ from '@berish/linq';
import { setHandler } from '../handlers';
import { StatefulObject } from '../types';
import { disableStorageWrite } from './disableStorageWrite';
import { getPrivateScope } from './getPrivateScope';
import { getScope } from './getScope';
import { getStorage } from './getStorage';

export function setState<T extends object>(proxy: StatefulObject<T>, state: Partial<T>, disableStorage: boolean): void {
  const scope = getScope(proxy);
  const privateScope = getPrivateScope(proxy);
  const oldKeys = Object.keys(scope.target);
  const newKeys = (state && typeof state === 'object' && Object.keys(state)) || [];
  const deleteKeys = LINQ.from(oldKeys).except(newKeys);

  const method = () => {
    if (newKeys && newKeys.length > 0) {
      for (const key of newKeys) {
        setHandler(scope, true, key, state[key]);
      }
    }

    if (deleteKeys && deleteKeys.length > 0) {
      for (const key of deleteKeys) {
        setHandler(scope, true, key, undefined);
      }
    }

    scope.saveStorage();
  };

  const asyncMethod = async () => {
    if (privateScope.setStateWait) await privateScope.setStateWait;

    privateScope.setStateWait = new Promise<void>((resolve) => {
      if (disableStorage) {
        disableStorageWrite(proxy, () => method());
      } else {
        method();
      }

      resolve();
      privateScope.setStateWait = null;
    });
  };

  asyncMethod();
}
