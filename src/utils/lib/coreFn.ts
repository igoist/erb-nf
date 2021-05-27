export const debounce = (fn: any, wait: number, immediate?: boolean) => {
  var timeout: any;

  return function () {
    var context = this,
      args = arguments;
    var later = () => {
      timeout = null;
      if (!immediate) fn.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) fn.apply(context, args);
  };
};
