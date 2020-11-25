import { StatefulObject, PropType } from '../types';
import { getScope, getPrivateScope, getRoots } from '../methods';

export function recordProps<T extends object>(stateful: StatefulObject<T>, props: PropType[]) {
  const scope = getScope(stateful);
  const privateScope = getPrivateScope(stateful);

  for (const id of privateScope.records) {
    const recordedProps = scope.getRecordProps(id);
    scope.setRecordProps(id, [...recordedProps, props]);
  }
  const links = getRoots(stateful);
  for (const [linkProp, linkStateful] of links) {
    recordProps(linkStateful, [linkProp, ...props]);
  }
}
