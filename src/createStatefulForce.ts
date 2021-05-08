import LINQ from '@berish/linq';
import { StatefulObject, StatefulPrivateScope } from './types';
import { SYMBOL_STATEFUL_PRIVATE_SCOPE } from './const';
import { createHandler } from './handlers';
import {
  saveStorage,
  setState,
  setValue,
  reaction,
  loadStorage,
  clearStorage,
  cleanRecord,
  listenChange,
  unlistenChange,
  listenStorage,
  unlistenAllStorage,
  getRecordProps,
  startRecord,
  stopRecord,
  getScope,
  getStorage,
  setRecordProps,
  listenChangeProps,
  disableStorageWrite,
} from './methods';
import { setStorage } from './methods/setStorage';

/**
 * Создает Stateful объект, на основе любого объекта.
 * Полученный объект является хранилищем, имеет дополнительными методами для работы с состоянием.
 * Возвращает строго некишированную версию Stateful, каждый раз создает новый объект.
 * @param target Объект, на основе которого создается Stateful
 */
export function createStatefulForce<T extends object>(target: T) {
  const resultProxy = Proxy.revocable<T>(target, createHandler());
  const stateful = resultProxy.proxy as StatefulObject<T>;
  const revoke = resultProxy.revoke;
  const scope = getScope(stateful);
  const privateScope: StatefulPrivateScope = {};

  scope.target = target;
  scope.stateful = stateful;
  scope[SYMBOL_STATEFUL_PRIVATE_SCOPE] = privateScope;

  privateScope.roots = LINQ.from();
  privateScope.records = [];
  privateScope.recordProps = {};
  privateScope.changePropsListeners = [];
  privateScope.storageListeners = [];

  scope.revoke = () => revoke();

  scope.cleanRecord = (id) => cleanRecord(stateful, id);
  scope.startRecord = (id) => startRecord(stateful, id);
  scope.stopRecord = (id) => stopRecord(stateful, id);
  scope.getRecordProps = (id) => getRecordProps(stateful, id);
  scope.setRecordProps = (id, value) => setRecordProps(stateful, id, value);
  scope.listenChange = (callback) => listenChange(stateful, callback);
  scope.listenChangeProps = (props, callback) => listenChangeProps(stateful, props, callback);
  scope.unlistenChange = (id) => unlistenChange(stateful, id);
  scope.disableStorageWrite = (callback) => disableStorageWrite(stateful, callback);

  scope.getStorage = () => getStorage(stateful);
  scope.setStorage = (storage) => setStorage(stateful, storage);
  scope.saveStorage = () => saveStorage(stateful);
  scope.loadStorage = () => loadStorage(stateful);
  scope.clearStorage = () => clearStorage(stateful);
  scope.listenStorage = () => listenStorage(stateful);
  scope.unlistenAllStorage = () => unlistenAllStorage(stateful);

  scope.reaction = (cb, reactionCallback) => reaction([stateful], cb, reactionCallback);
  scope.setState = (state, disableStorage) => setState(stateful, state, disableStorage);
  scope.setValue = (props, value, disableStorage) => setValue(stateful, props, value, disableStorage);

  return stateful;
}
