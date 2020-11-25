import { IStatefulScope, PropType } from '../types';
import { getHandler } from './getHandler';
import { setHandler } from './setHandler';
import { SYMBOL_STATEFUL_SCOPE } from '../const';

/**
 * Создает обработчики для чтения и изменения значений через ProxyHandler
 */
export function createHandler<T extends object>() {
  const scope: IStatefulScope<T> = {};
  const proxyHandler: ProxyHandler<T> = {
    get: function (target: T, prop: PropType) {
      if (prop === SYMBOL_STATEFUL_SCOPE) return scope;
      return getHandler(scope, prop);
    },
    set: function (target: T, prop: PropType, value: any) {
      if (prop === SYMBOL_STATEFUL_SCOPE) throw new Error(`You can't change default stateful scope`);
      return setHandler(scope, prop, value);
    },
  };
  return proxyHandler;
}
