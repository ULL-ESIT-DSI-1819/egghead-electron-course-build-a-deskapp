const path = require('path')
const url = require('url')
const electron = require("electron");
const {app, BrowserWindow, Menu} = electron;
const {MenuItem, globalShortcut, shell} = electron;

let win;

function createWindow() {

  win = new BrowserWindow({ width: 800, height: 600 })

  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }));


  win.on('closed', () => {
    win = null
  });
}

app.on('ready', function () {
  createWindow();

  const template = [
    {
      label: 'Electrones', // No aparece
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'pasteandmatchstyle' },
        { role: 'delete' },
        { role: 'selectall' },
        {role: 'quit'}
      ]
    },
    {
      label: 'Demo',
      submenu: [
        {
          label: 'Submenu1',
          click: function () {
            console.log('Clicked sub menu 1');
          }
        },
        {
          type: 'separator'
        },
        {
          label: 'Monarca',
          click: () => {
            console.log("Clicked Monarca");
            shell.beep();
            shell.openItem(path.join(__dirname,"images/7.jpg"));
          },
          accelerator: 'CmdOrCtrl+Alt+M'
        }
      ]
    },
    {
      label: 'Ayuda',
      submenu: [
        {
          label: 'About Electron',
          click: function () {
            shell.openExternal('http://electron.atom.io');
          },
          accelerator: 'CmdOrCtrl + Shift + H'
        }
      ]
    },
    {
      role: 'window',
      submenu: [
        { role: 'minimize' },
        { role: 'close' }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  globalShortcut.register('Alt+1', function () {
    win.show()
  })

});

app.on('will-quit', function () {
  globalShortcut.unregisterAll()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});

app.on('browser-window-created', function (event, win) {
  const ctxMenu = new Menu()
  ctxMenu.append(new MenuItem(
    {
      label: 'Hello',
      click: function(){
        console.log('ctx menu clicked')
      }
    }
  ))
  ctxMenu.append(new MenuItem({ role: 'selectall' }))
  win.webContents.on('context-menu', function (e, params) {
    ctxMenu.popup(win, params.x, params.y)
  })
})
