import { StatefulObject, IStatefulScope } from '../types';
import { SYMBOL_STATEFUL_SCOPE } from '../const';

export function getScope<T extends object>(stateful: StatefulObject<T>) {
  const scope = stateful && stateful[SYMBOL_STATEFUL_SCOPE];
  return scope as IStatefulScope<T>;
}
