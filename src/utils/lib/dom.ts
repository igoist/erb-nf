const htmlToElement = (html: string) => {
  let template = document.createElement('template');
  html = html.trim();
  template.innerHTML = html;
  return template.content.firstChild;
};

const Q = (s: string) => document.querySelector(s);
const QA = (s: string) => document.querySelectorAll(s);

/**
 * p: number     位置 position (deprecated)
 * delta: number 偏移值
 * target: dom   定位元素 target
 */
const scrollSmothlyTo = (delta: number, target?: any) => {
  // if (!window.requestAnimationFrame) {
  //   window.requestAnimationFrame = (callback, el) => {
  //     return setTimeout(callback, 17);
  //   }
  // }
  let scrollTop: number;
  if (target) {
    scrollTop = target.scrollTop;
  } else {
    scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  }

  const p: number = window.scrollY + delta;


  const step = () => {
    const distance = p - scrollTop;

    scrollTop += distance / 5;

    if (Math.abs(distance) < 1) {
      window.scrollTo(0, p);
    } else {
      window.scrollTo(0, scrollTop);
      requestAnimationFrame(step);
    }
  };

  step();
};

export { htmlToElement, Q, QA, scrollSmothlyTo };
