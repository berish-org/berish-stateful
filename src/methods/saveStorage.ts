import { StatefulObject } from '../types';
import { getStorage } from './getStorage';
import { getTarget } from './getTarget';

export async function saveStorage<T extends object>(stateful: StatefulObject<T>) {
  const storage = getStorage(stateful);

  // 1 MODE
  if (storage && storage.writeAccess) {
    const target = getTarget(stateful);
    await storage.save(target);
  }

  // 2 MODE
  // if (storage && storage.writeAccess) {
  //   setImmediate(async () => {
  //     try {
  //       const target = getTarget(stateful);
  //       await storage.save(target);
  //     } catch (err) {
  //       console.log((err && err.message) || err);
  //     }
  //   });
  // }
}
