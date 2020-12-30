import LINQ from '@berish/linq';
import { StatefulObject } from '../types';
import { getPrivateScope } from './getPrivateScope';

export function startRecord<T extends object>(stateful: StatefulObject<T>, id: string) {
  const privateScope = getPrivateScope(stateful);
  privateScope.records = LINQ.from(privateScope.records).concat(id).distinct();
}
