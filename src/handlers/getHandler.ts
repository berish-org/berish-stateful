import { IStatefulScope, PropType } from '../types';
import { getTarget, isStateful } from '../methods';
import { reflectGet, isPotentialStateful, recordProps, isLinked, link } from '../util';
import { createStateful } from '../createStateful';

/**
 * Обработчик чтения данных для IStatefulScope (getter метод)
 */
export function getHandler<T extends object>(scope: IStatefulScope<T>, prop: PropType) {
  const stateful = scope.stateful;
  const target = getTarget(stateful);
  const value = reflectGet(target, prop, stateful);

  recordProps(stateful, [prop]);

  /**
   * Значение является потенциальным stateful? Если нет, то отдаем просто значение
   */
  if (!isPotentialStateful(value)) return value;

  /**
   * Вдруг значение в target кто-то сам сделал уже stateful вне API фреймворка. Тогда отдаем stateful, который внути без доп логики
   */
  if (isStateful(value)) return value;

  /**
   * Cache-механизм
   * Проверяем, вдруг по текущему таргету уже есть готовый stateful, если даже и нет, то создаем совершенно новый
   */
  const subStateful = createStateful(value);
  if (!isLinked(stateful, prop, subStateful)) link(stateful, prop, subStateful);
  return subStateful;
}
