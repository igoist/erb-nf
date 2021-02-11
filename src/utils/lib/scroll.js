function animateScroll(element, speed) {
  let rect = element.getBoundingClientRect();
  // 获取元素相对窗口的top值，此处应加上窗口本身的偏移
  let top = window.pageYOffset + rect.top;
  let currentTop = 0;
  let requestId;
  console.log('in a');
  //采用requestAnimationFrame，平滑动画
  function step(timestamp) {
    // console.log('in step');
    currentTop += speed;
    if (currentTop <= top) {
      window.scrollTo(0, currentTop);
      requestId = window.requestAnimationFrame(step);
    } else {
      window.cancelAnimationFrame(requestId);
    }
  }
  window.requestAnimationFrame(step);
}

// 作者：shengbeiniao
// 链接：https://www.jianshu.com/p/f7c0b9072778

function animateScroll2(element, targetTop) {
  let currentTop = element.scrollTop;
  // let targetTop = 56 * index;
  const flag = currentTop < targetTop;
  const speed = 56 / 7 * (flag ? 1 : -1);

  let requestId;
  console.log('in a');

  //采用requestAnimationFrame，平滑动画
  function step() {
    // console.log('in step');
    currentTop += speed;
    if ((flag && currentTop < targetTop) || (!flag && currentTop > targetTop)) {
      element.scrollTop = currentTop;
      requestId = window.requestAnimationFrame(step);
    } else {
      window.cancelAnimationFrame(requestId);
    }
  }
  window.requestAnimationFrame(step);
}

/**
 * 这里有个疑问
 * 就是当...
 */
const returnCurrent = (current, index) => {
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
  animateScroll,
  animateScroll2,
  returnCurrent
}
