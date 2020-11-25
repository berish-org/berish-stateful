import { PropType, StatefulObject } from '../types';

export function reflectGet<T extends object>(target: T, prop: PropType, stateful: StatefulObject<T>) {
  return Reflect.get(target, prop, stateful);
}
