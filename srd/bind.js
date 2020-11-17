const electron = require('electron');
const utils = require('./utils');
const { exec } = require('child_process');

const { readFile, writeFile } = utils.file;
const { BrowserWindow, globalShortcut } = electron;

const bindEvents = (obj) => {
  console.log(obj);
  const { app, ipcMain, win, winWidth, winHeightUnit, screen, hideOrShowWin } = obj;

  ipcMain.on('change-win', (event, arg) => {
    let o = { x: 800, y: 56 };
    if (arg && arg.type) {
      if (arg.type === 'switch-pg') {
        if (arg.flag) {
          console.log(screen.getPrimaryDisplay());
          const { width, height } = screen.getPrimaryDisplay().workAreaSize;
          setTimeout(() => {
            console.log(width, height);
            win.setSize(width, height);
            win.center();
          }, 60);
        } else {
          win.setSize(o.x, o.y);
        }
      }
    } else {
      win.setSize(winWidth, winHeightUnit * (arg.listHeight + 1));
    }
    win.center();
  });

  ipcMain.on('get-list-item', async (event, arg) => {
    let r = await readFile('./data.json');

    win.webContents.send('list-item-data', {
      data: JSON.parse(r)
    });
  });

  ipcMain.on('save-list-item', async (event, arg) => {
    let r = await writeFile('./data.json', JSON.stringify(arg.data, null, 2));

    win.webContents.send('message-done', {
      status: r ? 'success' : 'error',
      msg: r ? '数据保存成功' : '数据保存失败'
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
        nodeIntegration: true
      }
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
        nodeIntegration: true
      }
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
