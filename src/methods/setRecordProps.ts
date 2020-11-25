import { StatefulObject, PropType } from '../types';
import { getPrivateScope } from './getPrivateScope';

export function setRecordProps<T extends object>(stateful: StatefulObject<T>, recordId: string, value: PropType[][]) {
  const privateScope = getPrivateScope(stateful);
  if (privateScope) {
    if (!privateScope.recordProps) privateScope.recordProps = {};
    if (!privateScope.recordProps[recordId]) privateScope.recordProps[recordId] = [];
    privateScope.recordProps[recordId] = value;
  }
}
