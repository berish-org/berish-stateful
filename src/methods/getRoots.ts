import LINQ from '@berish/linq';
import { StatefulObject } from '../types';
import { getPrivateScope } from './getPrivateScope';

export function getRoots<T extends object>(stateful: StatefulObject<T>) {
  const privateScope = getPrivateScope(stateful);
  return (privateScope && privateScope.roots) || LINQ.from();
}
