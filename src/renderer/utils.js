export const toObjectKeyedOn = key => (agg, curr) => {
  agg[curr[key]] = curr;
  return agg;
};
