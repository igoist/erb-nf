const fs = require('fs');
const path = require('path');
const electron = require('electron');

const child_process = require('child_process');
// const utils = require('./utils');
const bind = require('./bind');

const { ipcMain, app, BrowserWindow, globalShortcut, Menu, Tray } = electron;
// const { readFile, writeFile } = utils.file;

function pbcopy(data) {
  child_process.spawn('pbcopy');
  proc.stdin.write(data);
  proc.stdin.end();
}

const winWidth = 800;
const winHeightUnit = 56;
let win = null;

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

  // const contextMenu = Menu.buildFromTemplate([
  //   {
  //     label: 'Event',
  //     click: () => {
  //       // event.sender.send('tray-removed')
  //       console.log('Oh! Event!~');
  //       hideOrShowWin(true);
  //     }
  //   },
  //   {
  //     label: 'Quit',
  //     accelerator: 'CmdOrCtrl+E',
  //     click: () => {
  //       console.log('Oh! Quit!~');
  //       app.quit();
  //     }
  //   }
  // ]);

  // appIcon.setToolTip('Electron Demo in the tray.');
  // appIcon.setContextMenu(contextMenu);
  // =========================

  fs.readFile('./result.json', (err, data) => {
    if (err) throw err;
    let tmp = JSON.parse(data);
    global.sharedObject = {
      originData: tmp
    };
  });

  bind.bindEvents({
    app,
    ipcMain,
    win,
    winWidth,
    winHeightUnit,
    screen: electron.screen
  });

  // 打开开发者工具
  // win.webContents.openDevTools();
}

app.on('ready', createWindow);

setTimeout(() => {
  app.dock.hide();
}, 600);
