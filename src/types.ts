import LINQ from '@berish/linq';
import { SYMBOL_STATEFUL_SCOPE, SYMBOL_STATEFUL_PRIVATE_SCOPE } from './const';
import { StatefulStorage } from './storage';
import { Reaction, ReactionCallback } from './methods';

export type StatefulObject<T extends object> = T & {
  [SYMBOL_STATEFUL_SCOPE]: StatefulScope<T>;
};

export type PropType = string | symbol | number;

export type ListenChangePropsCallback = (props: PropType[], oldValue: any, newValue: any) => void;

export interface StatefulPrivateScope {
  roots?: LINQ<[PropType, StatefulObject<object>]>;
  records?: string[];
  recordProps?: {
    [id: string]: PropType[][];
  };
  storage?: StatefulStorage;
  changePropsListeners?: { id: string; callback: ListenChangePropsCallback; props: () => PropType[][] }[];
  storageListeners?: (() => void)[];

  setStateWait?: Promise<void>;
}

export interface StatefulScope<T extends object> {
  target?: T;
  stateful?: StatefulObject<T>;
  [SYMBOL_STATEFUL_PRIVATE_SCOPE]?: StatefulPrivateScope;

  revoke?: () => void;
  getRoots?: () => StatefulObject<object>[];

  cleanRecord?: (id: string) => void;
  startRecord?: (id: string) => void;
  stopRecord?: (id: string) => void;
  getRecordProps?: (id: string) => PropType[][];
  setRecordProps?: (id: string, value: PropType[][]) => void;
  listenChange?: (cb: ListenChangePropsCallback) => string;
  listenChangeProps?: (props: PropType[][] | (() => PropType[][]), cb: ListenChangePropsCallback) => string;
  reaction?: <TObject>(
    cb: (stateful: [StatefulObject<T>]) => TObject,
    reactionCallback: ReactionCallback<TObject>,
  ) => Reaction<TObject>;
  unlistenChange?: (listenId: string) => void;

  getStorage?: () => StatefulStorage;
  setStorage?: (storage: StatefulStorage) => void;
  saveStorage?: () => Promise<void>;
  loadStorage?: () => Promise<void>;
  clearStorage?: () => Promise<void>;
  listenStorage?: () => () => void;
  unlistenAllStorage?: () => void;
  disableStorageWrite?: <TData>(callback: () => TData) => TData;

  setState?: (state: Partial<T>, disableStorage?: boolean) => void;
  setValue?: (props: PropType[], value: any, disableStorage?: boolean) => void;
}

/**
 * Адаптер, для интеграции работы StatefulStorage с внешним источником данных
 */
export interface StatefulStorageAdapter {
  /**
   * Чтение значения по ключу
   */
  getItem: (key: string) => Promise<any>;

  /**
   * Запись значения по ключу и значению
   */
  setItem: (key: string, value: any) => Promise<void>;

  /**
   * Удаление значения по ключу
   */
  removeItem: (key: string) => Promise<void>;

  /**
   * Необязательное поле.
   * При наличии реализации метода позволяет обновлять Stateful из внешнего хранилища по callback
   */
  onChange?: (cb: (key: string, value: any) => void) => () => void;

  /**
   * Необязательное поле.
   * При наличии реализации метода выполняет сериализацию данных при записи во внешнее хранилище
   */
  serialize?: (value: any) => Promise<any>;

  /**
   * Необязательное поле.
   * При наличии реализации метода выполняет десериализацию данных при чтении из внешнего хранилища
   */
  deserialize?: (value: any) => Promise<any>;
}
