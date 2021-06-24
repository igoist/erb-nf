export const CE = (eTag: string) => {
  return document.createElement(eTag);
};

export const Q = (s: string, el?: any) => {
  const t = el ? el : document;

  return t.querySelector(s);
};

export const QA = (s: string, el?: any) => {
  const t = el ? el : document;

  return t.querySelectorAll(s);
};

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

export const ETZoom = (config: ETAnimationConfigType) => {
  config.name = 'zoom';

  ETAnimation(config);
};

export const getScroll = (w: any, top?: any) => {
  var ret = w['page' + (top ? 'Y' : 'X') + 'Offset'];
  var method = 'scroll' + (top ? 'Top' : 'Left');
  if (typeof ret !== 'number') {
    var d = w.document;
    ret = d.documentElement[method];
    if (typeof ret !== 'number') {
      ret = d.body[method];
    }
  }
  return ret;
};

export const setTransformOrigin = (node: any, value: any) => {
  var style = node.style;
  ['Webkit', 'Moz', 'Ms', 'ms'].forEach(function (prefix) {
    style[prefix + 'TransformOrigin'] = value;
  });
  style['transformOrigin'] = value;
};

export const offset = (el: any) => {
  var rect = el.getBoundingClientRect();
  var pos = {
    left: rect.left,
    top: rect.top,
  };
  var doc = el.ownerDocument;
  var w = doc.defaultView || doc.parentWindow;
  pos.left += getScroll(w);
  pos.top += getScroll(w, true);
  return pos;
};

export const htmlToElement = (html: string) => {
  let template = document.createElement('template');
  html = html.trim();
  template.innerHTML = html;
  return template.content.firstChild;
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
