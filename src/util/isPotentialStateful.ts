import type from '@berish/typeof';
import { isStateful } from '../methods';

export function isPotentialStateful(value: any): value is object {
  if (value && !isStateful(value)) {
    if (typeof value === 'object' && type(value) === 'object') return true;
    if (typeof value === 'object' && type(value) === 'array') return true;
  }
  return false;
}
