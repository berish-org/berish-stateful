import { StatefulObject } from '../types';
import { getPrivateScope } from './getPrivateScope';
import { StatefulStorage } from '../storage';

export function setStorage<T extends object>(stateful: StatefulObject<T>, storage: StatefulStorage) {
  const privateScope = getPrivateScope(stateful);
  if (privateScope) privateScope.storage = storage;
  return privateScope && privateScope.storage;
}
