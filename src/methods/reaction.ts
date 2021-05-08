import guid from 'berish-guid';
import { StatefulObject, PropType, StatefulScope } from '../types';
import { getScope } from './getScope';

export interface IReaction<T> {
  reactionId?: string;
  start: () => void;
  stop: () => void;
  isActive: () => boolean;
  revoke: () => void;
  result: () => T;
}

export interface IReactionResult<T> {
  oldResult: T;
  newResult: T;
  props: PropType[];
  stateful: StatefulObject<object>;
  oldValueInStore: any;
  newValueInStore: any;
}

export type IReactionCallback<T> = (result: IReactionResult<T>) => void | Promise<void>;

export function reaction<TStateful extends StatefulObject<object>[], T>(
  stores: TStateful,
  cb: (stateful: TStateful) => T,
  reactionCallback?: IReactionCallback<T>,
): IReaction<T> {
  const reactionId = guid.guid();
  let scopes = stores && stores.map((store) => getScope(store)).filter((m) => !!m);
  if (!scopes || scopes.length < 0) throw new Error('Need add stateful store in reaction');

  let propsModel: PropType[][][] = scopes.map(() => []);
  let listens: { listenId: string; scope: StatefulScope<object> }[] = null;
  let result: T = void 0;

  const recordProps = (): T => {
    _checkIsNotRevoked();

    scopes.forEach((scope) => scope.cleanRecord(reactionId));
    scopes.forEach((scope) => scope.startRecord(reactionId));

    const result = cb(stores);

    if (result instanceof Promise) {
      return result.then<T>((result) => {
        scopes.forEach((scope) => scope.stopRecord(reactionId));
        propsModel = scopes.map((scope) => scope.getRecordProps(reactionId));
        return result;
      }) as any;
    }
    scopes.forEach((scope) => scope.stopRecord(reactionId));
    propsModel = scopes.map((scope) => scope.getRecordProps(reactionId));
    return result;
  };

  const _checkIsNotRevoked = () => {
    if (isRevoked()) throw new Error('reaction revoked');
    return true;
  };

  const isActive = () => _checkIsNotRevoked() && listens && listens.length > 0;
  const isRevoked = () => !scopes;

  const start = (): void => {
    _checkIsNotRevoked();
    if (isActive()) return void 0;

    result = recordProps();

    listens = scopes.map((scope, index) => {
      const listenId = scope.listenChangeProps(
        () => (propsModel ? propsModel[index] : []),
        async (props, oldValue, newValue) => {
          const newResult = recordProps();
          if (reactionCallback) {
            await reactionCallback({
              oldResult: result,
              newResult,
              props,
              stateful: scope.stateful,
              oldValueInStore: oldValue,
              newValueInStore: newValue,
            });
          }
          result = newResult;
        },
      );

      return {
        listenId,
        scope,
      };
    });
  };

  const stop = (): void => {
    _checkIsNotRevoked();
    if (!isActive()) return void 0;

    listens.map(({ listenId, scope }) => scope.unlistenChange(listenId));
    listens = null;
  };

  const revoke = () => {
    if (isRevoked()) return void 0;
    if (stop) stop();
    scopes = null;
    propsModel = null;
    listens = null;
    result = null;
  };

  start();

  return { reactionId, start, stop, isActive, revoke, result: () => recordProps() };
}
