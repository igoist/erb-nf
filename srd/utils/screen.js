/**
 * 主要是为了多屏幕情况下, 获取当前屏幕
 * { ds, x, y } = config
 * ds: Array<any> 由 screen.getAllDisplays() 获得
 * x: number      当前 x
 * y: number      当前 y
 */
const getCurrentDisplay = (config) => {
  const { ds, x, y } = config;

  return ds.filter((d) => {
    const { bounds, size } = d;

    // bx <= x <= bx + bw && by <= y <= by + bh
    return bounds.x <= x && x <= bounds.x + size.width && bounds.y <= y && y <= bounds.y + size.height;
  })[0];
};

exports.getCurrentDisplay = getCurrentDisplay;
