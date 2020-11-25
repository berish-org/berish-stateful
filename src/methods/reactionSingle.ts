// import guid from 'berish-guid';
// import { StatefulObject, PropType } from '../types';
// import { getScope } from './getScope';

// export interface IReaction<T> {
//   reactionId?: string;
//   listenId?: string;
//   result: () => T;
// }

// export type IReactionCallback<T> = (
//   oldValue: T,
//   newValue: T,
//   props: PropType[],
//   oldValueByProp: any,
//   newValueByProp: any
// ) => void | Promise<void>;

// export function reactionSingle<TStateful extends object, T>(
//   stateful: StatefulObject<TStateful>,
//   cb: () => T,
//   reactionCallback: IReactionCallback<T>
// ): IReaction<T> {
//   const scope = getScope(stateful);
//   const reactionId = guid.guid();
//   let propsModel: PropType[][] = [];

//   const recordProps = () => {
//     scope.cleanRecord(reactionId);
//     scope.startRecord(reactionId);
//     const result = cb();
//     scope.stopRecord(reactionId);

//     propsModel = scope.getRecordProps(reactionId);
//     return result;
//   };

//   let result = recordProps();

//   const listenId = scope.listenChangeProps(
//     () => propsModel,
//     async (props, oldValue, newValue) => {
//       const newResult = recordProps();
//       await reactionCallback(result, newResult, props, oldValue, newValue);
//       result = newResult;
//     }
//   );

//   return { reactionId, listenId, result: () => recordProps() };
// }
