import { of } from '@berish/pathof';
import { StatefulObject } from '../types';
import { disableStorageWrite } from './disableStorageWrite';
import { getPrivateScope } from './getPrivateScope';
import { getStorage } from './getStorage';

export function setValue<T extends object>(
  proxy: StatefulObject<T>,
  props: (string | number | symbol)[],
  value: any,
  disableStorage?: boolean,
) {
  const pathof = props.reduce((obj, prop) => obj(prop as any), of(proxy));

  const method = () => {
    pathof.set(value);
  };

  if (disableStorage) return disableStorageWrite(proxy, () => method());
  return method();
}
