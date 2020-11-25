import * as ringle from 'berish-ringle';
import { createStatefulForce } from './createStatefulForce';
import { StatefulObject } from './types';

/**
 * Класс кеширования для Stateful объектов
 */
class StatefulCache {
  private _targetToStateful = new WeakMap<object, StatefulObject<object>>();

  /**
   * Получение кешированного Stateful по target.
   * Если в кеше нет Stateful, то создает новый Stateful объект
   * @param target
   * @param createStateful
   */
  get<T extends object>(target: T) {
    if (!this.has(target)) {
      const stateful = createStatefulForce(target);
      this._targetToStateful.set(target, stateful);
    }
    return this._targetToStateful.get(target) as StatefulObject<T>;
  }

  has<T extends object>(target: T) {
    return this._targetToStateful.has(target);
  }
}

export default ringle.getSingleton(StatefulCache);
