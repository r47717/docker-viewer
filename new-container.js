const path = require('path')
const url = require('url')
const { BrowserWindow, dialog, ipcMain } = require('electron')
const api = require('./docker-api')


let mainWindow
let dialogWindow

function createDialogWindow(parent) {
  mainWindow = parent
  dialogWindow = new BrowserWindow({
    parent, 
    modal: true, 
    show: true,
    useContentSize: true,
    resizable: false
  })

  dialogWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'new-container.html'),
    protocol: 'file:',
    slashes: true
  }))

  dialogWindow.setMenu(null)

  dialogWindow.on('closed', function () {
    dialogWindow = null
  })
}


function createNewContainer(mainWindow) {
  return () => {
    createDialogWindow(mainWindow)
  }
}


ipcMain.on('new-container-dialog-cancel', () => {
  dialogWindow.close()
  dialogWindow = null
})


ipcMain.on('new-container-dialog-create', (event, data) => {
  data = JSON.parse(data)

  api.createNewContainer(data.imageName, data.containerName, data.containerStart)
    .then(() => {
      console.log('container created')
      mainWindow.webContents.reload()
    })
    .catch((e) => {
      console.log('container create error: ' + e)
    })

  dialogWindow.close()
  dialogWindow = null
})


module.exports = createNewContainer
