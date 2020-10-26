type LooseObject = {
  [key: string]: any
};

export const deepCopyOA = (i: LooseObject) => {
  let o: LooseObject = {};
  for (let k in i) {
    if (typeof i[k] === 'object') {
      o[k] = deepCopyOA(i[k]);
    } else {
      o[k] = i[k];
    }
  }
  return o;
};
