import LINQ from '@berish/linq';
import { StatefulObject, PropType } from '../types';
import { getPrivateScope, isStateful } from '../methods';

export function link<T extends object>(
  rootStateful: StatefulObject<T>,
  prop: PropType,
  subStateful: StatefulObject<object>
) {
  const subPrivateScope = getPrivateScope(subStateful);
  if (subPrivateScope && isStateful(rootStateful)) {
    subPrivateScope.roots.push([prop, rootStateful]);
  }
}
