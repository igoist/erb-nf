/**
 * el
 * isEnter?: boolean
 * name?: string
 * callback?: () => {}
 */
export var hbFade = function (config: any) {
  var el = config.el;
  var isEnter = config.isEnter || false;

  var suffix = 'fade-' + (isEnter ? 'enter' : 'leave');
  var name = config.name ? config.name + '-' + suffix : suffix;
  var callback = config.callback;

  // 避免极端情况冲突
  if (el.className.indexOf('hb-' + name) !== -1) {
    console.log('enter hbFade return');
    return;
  }

  function handleFade() {
    el.classList.remove('hb-' + name);
    el.classList.remove('hb-' + name + '-active');
    el.removeEventListener('animationend', handleFade);

    if (callback) {
      callback();
    }
  }

  el.addEventListener('animationend', handleFade);

  el.classList.add('hb-' + name);
  el.classList.add('hb-' + name + '-active');
};

// 通用防抖
export var debounceFn = function (fn: any, wait: number, immediate?: any) {
  var timeout: any;
  return function () {
    var context = this,
      args = arguments;
    var later = function () {
      timeout = null;
      if (!immediate) fn.apply(context, args);
    };

    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) fn.apply(context, args);
  };
};

// 通用 form 字段 check 绑定
export var bindFormCheck = function (el: any, checkFn: any, event?: string) {
  var fn: any = debounceFn(checkFn, 100);

  el.addEventListener(event || 'blur', fn);
};

export var showError = function (el: any, msg: string) {
  var p = el.parentNode;

  if (p && !(p.className.indexOf('with-error') !== -1)) {
    var t = p.querySelector('.hb-form-item-explain');

    if (t) {
      t.textContent = msg;
      p.classList.add('with-error');

      hbFade({
        el: t,
        isEnter: true,
      });
    }
  }
};

export var hideError = function (el: any) {
  var p = el.parentNode;

  if (p && p.className.indexOf('with-error') !== -1) {
    var t = p.querySelector('.hb-form-item-explain');

    if (t) {
      hbFade({
        el: t,
        callback: function () {
          p.classList.remove('with-error');
        },
      });
    }
  }
};
