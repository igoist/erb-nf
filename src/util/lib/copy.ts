type LooseObject = {
  [key: string]: any
};

/**
 * deepCopyOA 主要是用来 copy 特定类型的 object，如：
 * {
 *   a: 1,
 *   b: '2',
 *   c: {
 *     d: '1',
 *   }
 * }
 *
 * 用在当前项目 hook 状态 data 数组遍历，每个 item 执行 deepCopyOA 返回一个深拷贝对象，最后以数组形式返回
 *
 * 后续如果想比较全面地去 copy 任意复杂类型对象，需要在此基础上补充，可参考 lodash 的实现
 */
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
