import { StatefulObject } from '../types';
import { getPrivateScope } from './getPrivateScope';

export function getRecordProps<T extends object>(stateful: StatefulObject<T>, id: string) {
  const privateScope = getPrivateScope(stateful);
  if (privateScope) {
    if (!privateScope.recordProps) privateScope.recordProps = {};
    if (!privateScope.recordProps[id]) privateScope.recordProps[id] = [];
    return privateScope.recordProps[id];
  }
  return [];
}
