import { StatefulObject } from '../types';
import { getPrivateScope } from './getPrivateScope';

export function getStorage<T extends object>(stateful: StatefulObject<T>) {
  const privateScope = getPrivateScope(stateful);
  return privateScope && privateScope.storage;
}
