const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')

let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800, 
    height: 600,
    show: false, 
    frame: false,
    title: "Project Cthulhu Protocol",
    titleBarStyle: 'hidden-inset',
    icon: './view/images/cthullu-icon-64.png'
  })

    //Chao Blink
    mainWindow.once('ready-to-show', () => {
        mainWindow.show()
    })

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'view/index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

app.on('ready', createWindow)

/*
app.on('browser-window-created', function(e, window) {
  window.setMenu(null);
});
*/

// Quit when all windows are closed.
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
