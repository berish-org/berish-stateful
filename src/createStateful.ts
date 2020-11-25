import cache from './cache';

/**
 * Создает Stateful объект, на основе любого объекта.
 * Полученный объект является хранилищем, имеет дополнительными методами для работы с состоянием.
 * Если на основе объекта уже был создан Stateful объект, то возвращает кешированную версию Stateful
 * @param target Объект, на основе которого создается Stateful объект
 */
export function createStateful<T extends object>(target: T) {
  return cache.get<T>(target);
}
