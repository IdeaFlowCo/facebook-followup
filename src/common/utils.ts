import _ from "lodash";
import { getterSetter } from "../renderer/stateLogic";
export const toObjectKeyedOn = (key: string) => (
  agg: { [k: string]: any },
  curr: { [k: string]: any }
) => {
  agg[curr[key]] = curr;
  return agg;
};

export const join = (as: any[], bs: any[]) => {
  let aJoinB: [any, any][] = [];
  for (const a of as) {
    for (const b of bs) {
      aJoinB.push([a, b]);
    }
  }
  return aJoinB;
};

type update = { [id: string]: { [q: string]: any } };

export type updateStored<T> = (
  store: getterSetter<T>,
  updates: update | update[]
) => void;

export const updateStored: updateStored<any> = (store, _updates) => {
  //{key:{unreadCount: 0 }}
  const toUpdates = (updateObj: any) => {
    const [key, newVal] = Object.entries(_updates)[0];
    const original = store[0][key];
    return { [key]: { ...original, ...newVal, __key: key } };
  };
  const updates =
    _updates instanceof Array
      ? _.keyBy(_updates.map(toUpdates), "__key")
      : toUpdates(_updates);

  store[1]({
    ...store[0],
    ...updates
  });
};
