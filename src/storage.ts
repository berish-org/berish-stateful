import { IStatefulStorageAdapter } from './types';

/**
 * Адаптер, для работы
 */
export class StatefulStorage {
  private _storageAdapter: IStatefulStorageAdapter = null;
  private _writeAccess: boolean = true;
  private _name: string = null;

  constructor(name: string, storageAdapter: IStatefulStorageAdapter) {
    this._storageAdapter = storageAdapter;
    this.name = name;
  }

  get name() {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  get writeAccess() {
    return this._writeAccess;
  }

  set writeAccess(value: boolean) {
    this._writeAccess = value;
  }

  get adapter() {
    return this._storageAdapter;
  }

  public async save(state: any) {
    const newState = (this.adapter.serialize && (await this.adapter.serialize(state))) || state;
    if (this.writeAccess && this.adapter.setItem) await this.adapter.setItem(this.name, newState);
  }

  public async load() {
    const state = this.adapter.getItem && (await this.adapter.getItem(this.name));
    const newState = (this.adapter.deserialize && (await this.adapter.deserialize(state))) || state;
    return newState;
  }

  public async clear() {
    await this.adapter.removeItem(this.name);
  }

  public changes(cb: (state: any) => void) {
    if (this.adapter.onChange) {
      return this.adapter.onChange(async (key, state) => {
        if (key === this.name) {
          const newState = (this.adapter.deserialize && (await this.adapter.deserialize(state))) || state;
          cb(newState);
        } else if (!key) {
          cb({});
        }
      });
    }
    return null;
  }
}
