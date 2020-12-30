import LINQ from '@berish/linq';
import { StatefulObject } from '../types';
import { getPrivateScope } from './getPrivateScope';

export function unlistenChange<T extends object>(stateful: StatefulObject<T>, id: string) {
  const privateScope = getPrivateScope(stateful);
  privateScope.changePropsListeners = LINQ.from(privateScope.changePropsListeners).where((m) => m.id !== id);
}
