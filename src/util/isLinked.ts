import LINQ from '@berish/linq';
import { StatefulObject, PropType } from '../types';
import { getPrivateScope, isStateful } from '../methods';

export function isLinked<T extends object>(
  rootStateful: StatefulObject<T>,
  props: PropType,
  subStateful: StatefulObject<object>,
) {
  const subPrivateScope = getPrivateScope(subStateful);
  if (subPrivateScope && isStateful(rootStateful))
    return LINQ.from(subPrivateScope.roots).count((data) => data[0] === props && data[1] === rootStateful) > 0;
  return false;
}
