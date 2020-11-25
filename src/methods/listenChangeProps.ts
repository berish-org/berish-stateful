import guid from 'berish-guid';
import LINQ from '@berish/linq';
import { StatefulObject, ListenChangePropsCallback, PropType } from '../types';
import { getPrivateScope } from './getPrivateScope';

export function listenChangeProps<T extends object>(
  stateful: StatefulObject<T>,
  getProps: PropType[][] | (() => PropType[][]),
  callback: ListenChangePropsCallback
) {
  const id = guid.guid();
  const privateScope = getPrivateScope(stateful);
  privateScope.changePropsListeners = LINQ.from(privateScope.changePropsListeners).concat({
    id,
    callback,
    props: getProps ? () => (typeof getProps === 'function' ? getProps() : getProps) : void 0,
  });
  return id;
}
