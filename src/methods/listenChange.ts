import { StatefulObject, ListenChangePropsCallback } from '../types';
import { listenChangeProps } from './listenChangeProps';

export function listenChange<T extends object>(stateful: StatefulObject<T>, callback: ListenChangePropsCallback) {
  return listenChangeProps(stateful, null, callback);
}
