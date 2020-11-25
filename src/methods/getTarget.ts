import { StatefulObject } from '../types';
import { getScope } from './getScope';
import { isStateful } from './isStateful';

export function getTarget<T>(stateful: T): T;
export function getTarget<T extends object>(stateful: T | StatefulObject<T>): T;
export function getTarget<T>(stateful: any | StatefulObject<object>): T {
  if (isStateful(stateful)) {
    const scope = getScope(stateful);
    return scope && ((scope.target as any) as T);
  }
  return stateful;
}
