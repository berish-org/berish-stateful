import { IStatefulScope, PropType } from '../types';
import { getTarget, isStateful } from '../methods';
import { reflectGet, reflectSet, changeProps, isPotentialStateful, isLinked, link, unlink } from '../util';
import cache from '../cache';
import { createStateful } from '../createStateful';
import { create } from 'domain';

/**
 * Обработчик записи данных длЯ IStatefulScope (setter метод)
 */
export function setHandler<T extends object>(scope: IStatefulScope<T>, prop: PropType, value: any) {
  const stateful = scope.stateful;
  const target = getTarget(stateful);
  const oldValue = reflectGet(target, prop, stateful);

  if (isStateful(oldValue)) {
    /**
     * Root-механизм
     * Если раньше был stateful и он связан, то отвязываем
     */
    if (isLinked(stateful, prop, oldValue)) unlink(stateful, prop, oldValue);
  }

  if (isStateful(value)) {
    /**
     * Общий механизм
     * Должны так же записать target от stateful, а не сам stateful
     */
    value = getTarget(value);
  }

  /**
   * Общий механизм
   * Здесь задаем значение.
   * И если вдруг у сеттера внутри есть свое поведение, которое может менять объект, для консистентности данных запрашиваем еще раз значение
   */
  const result = reflectSet(target, prop, value, stateful);
  if (!result) return false;
  // value = reflectGet(target, prop, stateful);

  /**
   * Root-механизм
   * Создание кешированного stateful для значения
   * Если ребенок не связан с текущим stateful, то связываем
   */
  if (isPotentialStateful(value)) {
    const subStateful = createStateful(value);
    if (!isLinked(stateful, prop, subStateful)) link(stateful, prop, subStateful);
  }

  /**
   * Общий механизм
   * Вызываем callback изменения значений
   */
  if (oldValue !== value) changeProps(stateful, [prop], oldValue, value);
  return true;
}
