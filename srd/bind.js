const electron = require('electron');
const utils = require('./utils');
const { exec } = require('child_process');

const { readFile, writeFile } = utils.file;
const { getCurrentDisplay } = utils.screen;
const { BrowserWindow, globalShortcut } = electron;

const bindEvents = (obj) => {
  const { app, ipcMain, win, winWidth, winHeightUnit, screen } = obj;

  let winFlag = true;

  const hideOrShowWin = (ifShow) => {
    if (ifShow) {
      win.show();
      winFlag = true;
    } else {
      win.hide();
      winFlag = false;
    }
  };

  // etWindow 相关
  let etWindowIgnoreMouseEvents = false;

  ipcMain.on('et-set-window', (event, arg) => {
    const { type, payload } = arg;

    if (type === 'et-ignore-mouse-event' && payload !== etWindowIgnoreMouseEvents) {
      if (payload) {
        etWindowIgnoreMouseEvents = true;
        win.setIgnoreMouseEvents(true, {
          forward: true,
        });
      } else {
        etWindowIgnoreMouseEvents = false;
        win.setIgnoreMouseEvents(false);
      }
    }
  });

  /**
   * 应用发送该事件之后, 分情况调整窗口尺寸、位置
   * 注意 fullScreen 时需要通过 getCurrentDisplay 获得当前窗口
   */
  ipcMain.on('change-win', (event, arg) => {
    let o = { x: 800, y: 56 };
    if (arg && arg.type) {
      if (arg.type === 'switch-full-screen') {
        if (arg.flag) {
          const ds = screen.getAllDisplays();
          const { x, y } = win.getBounds();

          const z = getCurrentDisplay({
            ds,
            x,
            y,
          });

          const { width, height } = z.size;

          setTimeout(() => {
            win.setSize(width, height);
            win.center();
            win.webContents.send('switch-full-screen-complete');
          }, 32);
        } else {
          win.setSize(o.x, o.y);
        }
      }

      if (arg.type === 'to-mode-zero') {
        win.setSize(winWidth, winHeightUnit * (arg.listHeight + 1));
        win.center();
      }
    } else {
      win.setSize(winWidth, winHeightUnit * (arg.listHeight + 1));
    }
    // win.center();
  });

  ipcMain.on('et-to-mode-zero', (event, arg) => {
    win.webContents.send('et-to-mode-zero-renderer');
  });

  ipcMain.on('et-fade-leave', (event, arg) => {
    win.webContents.send('et-fade-leave-renderer');
  });

  ipcMain.on('get-list-item', async (event, arg) => {
    let r = await readFile('./data.json');

    win.webContents.send('list-item-data', {
      data: JSON.parse(r),
    });
  });

  ipcMain.on('save-list-item', async (event, arg) => {
    let r = await writeFile('./data.json', JSON.stringify(arg.data, null, 2));

    win.webContents.send('message-done', {
      status: r ? 'success' : 'error',
      msg: r ? '数据保存成功' : '数据保存失败',
    });
  });

  ipcMain.on('open-tab', (event, arg) => {
    exec(`/Applications/Google\\ Chrome.app/Contents/MacOS/Google\\ Chrome --incognito ${arg.link}`, (err, stdout, stderr) => {
      if (err) {
        console.log(err);
        return;
      }
      console.log(`${stdout}${arg.link}${stderr ? ' --' + stderr : ''}`);
    });
  });

  win.on('close', (e) => {
    console.log('app.quitting? ', app.quitting);
    if (app.quitting) {
      win = null;
    } else {
      e.preventDefault();
      hideOrShowWin(false);
    }
  });

  globalShortcut.register('Alt+Space', () => {
    if (winFlag) {
      hideOrShowWin(false);
    } else {
      hideOrShowWin(true);
    }
  });

  globalShortcut.register('Alt+S', () => {
    win.webContents.send('focus-toggle');
  });

  // globalShortcut.register('Cmd+C', () => {
  //   exec('pbcopy', (err, stdout, stderr) => {
  //     if (err) {
  //       console.log('here');
  //       return ;
  //     }
  //     console.log(`stdout: ${stdout}`);
  //     console.log(`stderr: ${stderr}`);
  //   });
  //   // return false;
  // });

  globalShortcut.register('CmdOrCtrl+Y', () => {
    console.log('CmdOrCtrl+Y');

    const modalPath = 'http://localhost/~egoist/Web/goods/Daily/181031/Universe/index.html';
    let tmpWin = new BrowserWindow({
      width: 76,
      height: 76,
      frame: false,
      skipTaskbar: true,
      resizable: true,
      webPreferences: {
        nodeIntegration: true,
      },
    });

    tmpWin.on('close', () => {
      tmpWin = null;
    });
    tmpWin.setOpacity(0.8);
    tmpWin.loadURL(modalPath);
    tmpWin.show();
    // setTimeout(() => {
    //   tmpWin.center();
    // }, 1000);
    // console.log(tmpWin.isMovable());
  });

  globalShortcut.register('CmdOrCtrl+U', biuBiu);

  ipcMain.on('key-menu', biuBiu);

  globalShortcut.register('Ctrl+M', () => {
    win.webContents.send('mode-change');
  });

  globalShortcut.register('Ctrl+N', () => {
    win.center();
    hideOrShowWin(true);
  });

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    hideOrShowWin(true);
  });

  app.on('before-quit', () => (app.quitting = true));
};

exports.bindEvents = bindEvents;

let ttt;
let tttF = true;
let tttDoing = false;

const biuBiu = (e, args) => {
  console.log('CmdOrCtrl+U');
  if (ttt) {
    // if (args && args.type) {
    //   console.log(args);
    //   return;
    // }

    if (!tttDoing) {
      if (tttF) {
        ttt.webContents.send('key-menu', { type: 'hide' });
        // ttt.hide();
      } else {
        ttt.webContents.send('key-menu', { type: 'show' });
        // ttt.show();
      }
      tttF = !tttF;
    }
  } else {
    // const modalPath = 'http://localhost/~egoist/Web/draft/demo0037/';
    const modalPath = `file://${path.join(path.resolve(__dirname, '../'), './src/plugins/KeyMenu/index.html')}`;
    console.log(modalPath);
    ttt = new BrowserWindow({
      width: 600,
      height: 90,
      frame: false,
      skipTaskbar: true,
      resizable: false,
      transparent: true,
      webPreferences: {
        nodeIntegration: true,
      },
    });

    ttt.on('close', () => {
      ttt = null;
    });
    ttt.on('blur', () => {
      console.log('ttt blur');
    });
    // ttt.setOpacity(0.8);
    ttt.loadURL(modalPath);
    ttt.show();
  }
};
