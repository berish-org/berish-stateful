import LINQ from '@berish/linq';
import { StatefulObject } from '../types';
import { getStorage } from './getStorage';
import { setState } from './setState';
import { getPrivateScope } from './getPrivateScope';

export function listenStorage<T extends object>(stateful: StatefulObject<T>) {
  const storage = getStorage(stateful);
  const privateScope = getPrivateScope(stateful);
  if (storage) {
    const unlistener = storage.changes((state) => setState(stateful, state, true));
    privateScope.storageListeners = LINQ.from(privateScope.storageListeners).concat(unlistener);
    return unlistener;
  }
  return void 0;
}
