import { StatefulObject, PropType } from '../types';
import { getScope, getPrivateScope, getRoots } from '../methods';
import LINQ from '@berish/linq';

export async function changeProps<T extends object>(
  stateful: StatefulObject<T>,
  isFromSetState: boolean,
  props: PropType[],
  oldValue: any,
  newValue: any,
) {
  if (!Object.is(oldValue, newValue)) {
    const scope = getScope(stateful);
    const privateScope = getPrivateScope(stateful);

    if (privateScope.setStateWait) {
      await privateScope.setStateWait;
    }

    for (const listener of privateScope.changePropsListeners) {
      if (listener.props) {
        const propsWhenUpdate = LINQ.from(listener.props());
        if (propsWhenUpdate.some((m) => LINQ.from(m).equalsValues(props))) {
          listener.callback(props, oldValue, newValue);
        }
      } else {
        listener.callback(props, oldValue, newValue);
      }
    }

    const links = getRoots(stateful);
    for (const [linkProp, linkStateful] of links) {
      changeProps(linkStateful, isFromSetState, [linkProp, ...props], oldValue, newValue);
    }

    if (!isFromSetState) {
      scope.saveStorage();
    }
  }
}
