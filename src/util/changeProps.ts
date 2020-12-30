import { StatefulObject, PropType } from '../types';
import { getScope, getPrivateScope, getRoots } from '../methods';
import LINQ from '@berish/linq';

export function changeProps<T extends object>(
  stateful: StatefulObject<T>,
  props: PropType[],
  oldValue: any,
  newValue: any,
) {
  const scope = getScope(stateful);
  const privateScope = getPrivateScope(stateful);

  scope.saveStorage();

  for (const listener of privateScope.changePropsListeners) {
    if (listener.props) {
      const propsWhenUpdate = LINQ.from(listener.props());
      if (propsWhenUpdate.some((m) => LINQ.from(m).equalsValues(props))) listener.callback(props, oldValue, newValue);
    } else listener.callback(props, oldValue, newValue);
  }

  const links = getRoots(stateful);
  for (const [linkProp, linkStateful] of links) {
    changeProps(linkStateful, [linkProp, ...props], oldValue, newValue);
  }
}
