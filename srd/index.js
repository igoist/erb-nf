const fs = require('fs');
const path = require('path');
const { ipcMain, app, BrowserWindow, globalShortcut, Menu, Tray } = require('electron');
const { exec } = require('child_process');
const child_process = require('child_process');
const utils = require('./utils');

const { readFile, writeFile } = utils.file;

function pbcopy(data) {
  child_process.spawn('pbcopy');
  proc.stdin.write(data);
  proc.stdin.end();
}

const winWidth = 800;
const winHeightUnit = 56;
let win = null;
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

function createWindow() {
  // 创建浏览器窗口
  win = new BrowserWindow({
    width: winWidth,
    height: winHeightUnit,
    // file: './index.html'
    // webPreferences: {
    //   webSecurity: false
    // },
    title: 'ElectronFzf',
    // backgroundColor: '#80FFFFFF',
    // transparent: true,
    frame: false,
    resizable: false,
    webPreferences: {
      nodeIntegration: true
    }
  });

  // 然后加载应用的 index.html。
  win.loadURL('http://localhost:3101/index.html');
  win.setOpacity(0.88);

  // =========================
  // Tray 文件盒；托盘；隔底匣；（无线电的）发射箱
  const iconName = 'iconTemplate.png'; // process.platform === 'win32' ? 'windows-icon.png' : 'iconTemplate.png'
  console.log(path.join(__dirname, 'public/img'));
  const iconPath = path.join(path.join(path.resolve(__dirname, '../'), 'public/img'), iconName);
  appIcon = new Tray(iconPath);

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Event',
      click: () => {
        // event.sender.send('tray-removed')
        console.log('Oh! Event!~');
        hideOrShowWin(true);
      }
    },
    {
      label: 'Quit',
      accelerator: 'CmdOrCtrl+E',
      click: () => {
        console.log('Oh! Quit!~');
        app.quit();
      }
    }
  ]);

  appIcon.setToolTip('Electron Demo in the tray.');
  appIcon.setContextMenu(contextMenu);
  // =========================

  fs.readFile('./result.json', (err, data) => {
    if (err) throw err;
    let tmp = JSON.parse(data);
    global.sharedObject = {
      originData: tmp
    };
  });

  ipcMain.on('change-win', (event, arg) => {
    win.setSize(winWidth, winHeightUnit * (arg.listHeight + 1));
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

  // 打开开发者工具
  // win.webContents.openDevTools();

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
}

app.on('ready', createWindow);

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

setTimeout(() => {
  app.dock.hide();
}, 600);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  hideOrShowWin(true);
});

app.on('before-quit', () => (app.quitting = true));
