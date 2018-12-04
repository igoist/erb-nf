const returnCurrent = (current: number, index: number) => {
  // console.log('current: ', current, 'index: ', index);
  if (index - current > 9) {
    return index - 9;
  }
  if (current > index) {
    return index;
  }
  return current;
};

export {
  returnCurrent
}