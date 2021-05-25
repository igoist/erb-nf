export const htmlToElement = (html: string) => {
  let template = document.createElement('template');
  html = html.trim();
  template.innerHTML = html;
  return template.content.firstChild;
};

export const Q = (s: string) => document.querySelector(s);

export const QA = (s: string) => document.querySelectorAll(s);

export const hasClass = (className: string, el: any) => {
  if (el) {
    return el.className.indexOf(className) !== -1;
  }

  return false;
};

export const addClass = (className: string, el: any) => {
  if (el) {
    el.classList.add(className);
  }
};

export const removeClass = (className: string, el: any) => {
  if (el) {
    el.classList.remove(className);
  }
};

export const toggleClass = (className: string, el: any) => {
  if (el) {
    if (hasClass(className, el)) {
      removeClass(className, el);
    } else {
      addClass(className, el);
    }
  }
};

interface ETAnimationConfigType {
  el: any;
  name?: string;
  isEnter?: boolean;
  callback?: () => any;
}

/**
 * el
 * name: string    'fade' | 'slide-up'
 * isEnter?: boolean
 * callback?: () => {}
 */
export const ETAnimation = (config: ETAnimationConfigType) => {
  // tmp prefix
  const prefix = 'et';

  const { el, name, isEnter = false, callback } = config;

  const suffix = isEnter ? 'enter' : 'leave';

  const pf = `${prefix}-${name}-${suffix}`;

  // 避免冲突
  if (hasClass(`${pf}`, el)) {
    return;
  }

  const handleFade = () => {
    el.classList.remove(`${pf}`);
    el.classList.remove(`${pf}-active`);
    el.removeEventListener('animationend', handleFade);

    if (callback) {
      callback();
    }
  };

  el.addEventListener('animationend', handleFade);
  el.classList.add(`${pf}`);
  el.classList.add(`${pf}-active`);
};

export const ETFade = (config: ETAnimationConfigType) => {
  config.name = 'fade';

  ETAnimation(config);
};

/**
 * p: number     位置 position (deprecated)
 * delta: number 偏移值
 * target: dom   定位元素 target
 */
export const scrollSmothlyTo = (delta: number, target?: any) => {
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
