import { StatefulObject } from '../types';
import { getPrivateScope } from './getPrivateScope';

export function cleanRecord<T extends object>(stateful: StatefulObject<T>, id: string) {
  const privateScope = getPrivateScope(stateful);
  if (privateScope.recordProps[id]) delete privateScope.recordProps[id];
}
