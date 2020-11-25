import { PropType, StatefulObject } from '../types';

export function reflectSet<T extends object>(target: T, prop: PropType, value: any, stateful: StatefulObject<T>) {
  return Reflect.set(target, prop, value, stateful);
}
