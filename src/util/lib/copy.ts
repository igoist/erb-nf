type LooseObject = {
  [key: string]: any
};

export const deepCopyOA = (i: LooseObject) => {
  let o: LooseObject = {};
  for (let k in i) {
    o[k] = i[k];
  }
  return o;
};
