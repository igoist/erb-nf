const fs = require('fs');
const path = require('path');
const { ipcMain, app, BrowserWindow, globalShortcut, Menu, Tray } = require('electron');

const winWidth = 800;
const winHeightUnit = 56;
let win = null;
let winFlag = true;

const hideOrShowWin = ifShow => {
  if (ifShow) {
    win.show();
    winFlag = true;
  } else {
    win.hide();
    winFlag = false;
  }
}

function createWindow () {
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
    resizable: false
  });

  // 然后加载应用的 index.html。
  win.loadURL('http://localhost:3101/index.html');
  win.setOpacity(0.88);

  // =========================
  // Tray 文件盒；托盘；隔底匣；（无线电的）发射箱
  const iconName = 'iconTemplate.png' // process.platform === 'win32' ? 'windows-icon.png' : 'iconTemplate.png'
  console.log(path.join(__dirname, 'public/img'));
  const iconPath = path.join(path.join(__dirname, 'public/img'), iconName)
  appIcon = new Tray(iconPath)

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
  ])

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

  // 打开开发者工具
  win.webContents.openDevTools();

  win.on('close', e => {
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
  globalShortcut.register('CmdOrCtrl+Y', () => {
    console.log('CmdOrCtrl+Y');

    const modalPath = 'http://localhost/~egoist/Web/goods/Daily/181031/Universe/index.html';
    let tmpWin = new BrowserWindow({
      width: 76,
      height: 76,
      frame: false,
      resizable: false
    });

    tmpWin.on('close', () => { tmpWin = null });
    tmpWin.setOpacity(0.8);
    tmpWin.loadURL(modalPath);
    tmpWin.show();
    setTimeout(() => {
      tmpWin.center();
    }, 1000);
    console.log(tmpWin.isMovable());
  });
  globalShortcut.register('Ctrl+M', () => {
    win.webContents.send('mode-change');
  });
}

app.on('ready', createWindow);

setTimeout(() => {
  app.dock.hide();
}, 600);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => { hideOrShowWin(true) });

app.on('before-quit', () => app.quitting = true);
