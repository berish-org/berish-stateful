import { StatefulObject } from '../types';
import { getScope } from '../methods';

export function isStateful<T extends object>(value: any): value is StatefulObject<T> {
  if (value && typeof value === 'object' && getScope(value)) return true;
  return false;
}
