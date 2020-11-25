import LINQ from '@berish/linq';
import { StatefulObject, PropType } from '../types';
import { getPrivateScope, isStateful } from '../methods';

export function unlink<T extends object>(
  rootStateful: StatefulObject<T>,
  prop: PropType,
  subStateful: StatefulObject<object>
) {
  const subPrivateScope = getPrivateScope(subStateful);
  if (subPrivateScope && isStateful(rootStateful)) {
    subPrivateScope.roots = LINQ.from(subPrivateScope.roots).where(
      data => data[0] !== prop || data[1] !== rootStateful
    );
  }
}
