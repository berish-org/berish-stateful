import LINQ from '@berish/linq';
import { StatefulObject } from '../types';
import { getPrivateScope } from './getPrivateScope';

export function stopRecord<T extends object>(stateful: StatefulObject<T>, id: string) {
  const privateScope = getPrivateScope(stateful);
  privateScope.records = LINQ.from(privateScope.records).except(id).distinct();
}
