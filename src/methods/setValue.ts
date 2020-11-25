import { of } from '@berish/pathof';
import { StatefulObject } from '../types';

export function setValue<T extends object>(proxy: StatefulObject<T>, props: (string | number | symbol)[], value: any) {
  const pathof = props.reduce((obj, prop) => obj(prop as any), of(proxy));
  pathof.set(value);
}
