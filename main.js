const { app, BrowserWindow, Menu } = require('electron')
const path = require('path')
const url = require('url')

let mainWindow

function createWindow () {
  mainWindow = new BrowserWindow({titleBarStyle: 'hidden',
     width: 1280,
     height: 800,
     minWidth: 600,
     minHeight: 400,
     backgroundColor: '#312450',
     show: false
 })

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  mainWindow.on('closed', function () {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })

  // Menu
  const template = [,
    {
      label: 'Merge CSV',
      submenu: [
        {
          label: 'Close Window',
          accelerator: process.platform === 'darwin' ? 'Command+W' : 'Ctrl+W',
          click: () => {
            mainWindow.close()
            mainWindow = null
          }
        },
        {
          label: 'Quit',
          accelerator: process.platform === 'darwin' ? 'Command+Q' : 'Ctrl+Q',
          click: () => {
            app.quit()
          }
        }
      ]
    }
  ]

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)

  mainWindow.once('ready-to-show', () => {
     mainWindow.show()
 })
}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})
