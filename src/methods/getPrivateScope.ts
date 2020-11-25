import { StatefulObject, IStatefulScope } from '../types';
import { SYMBOL_STATEFUL_SCOPE, SYMBOL_STATEFUL_PRIVATE_SCOPE } from '../const';

export function getPrivateScope<T extends object>(proxy: StatefulObject<T>) {
  const scope = proxy && proxy[SYMBOL_STATEFUL_SCOPE];
  const privateScope = scope && scope[SYMBOL_STATEFUL_PRIVATE_SCOPE];
  return privateScope;
}
