import LINQ from '@berish/linq';
import { StatefulObject } from '../types';
import { getPrivateScope } from './getPrivateScope';

export function unlistenAllStorage<T extends object>(proxy: StatefulObject<T>) {
  const privateScope = getPrivateScope(proxy);
  LINQ.from(privateScope.storageListeners).forEach((m) => m && setTimeout(() => m(), 0));
  privateScope.storageListeners = [];
}
