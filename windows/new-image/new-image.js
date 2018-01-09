const path = require('path')
const url = require('url')
const { BrowserWindow, dialog, ipcMain } = require('electron')
const api = require('../../docker-api')


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
    pathname: path.join(__dirname, 'new-image.html'),
    protocol: 'file:',
    slashes: true
  }))

  dialogWindow.setMenu(null)

  dialogWindow.on('closed', function () {
    dialogWindow = null
  })
}


function createNewImage(mainWindow) {
  return () => {
    createDialogWindow(mainWindow)
  }
}


ipcMain.on('new-image-dialog-cancel', () => {
  dialogWindow.close()
  dialogWindow = null
})


ipcMain.on('new-image-dialog-create', (event, data) => {
  data = JSON.parse(data)

  dialogWindow.setTitle(`Creating Image '${data.imageName}'...`)

  api.createNewImage(data.imageName)
    .then(() => {
      console.log('image created')
      dialogWindow.setTitle(`Creating Image done`)
      dialogWindow.close()
      dialogWindow = null
      mainWindow.webContents.reload()
    })
    .catch((e) => {
      console.log('image create error: ' + e)
      dialogWindow.setTitle(`Creating Image error`)
      dialogWindow.close()
      dialogWindow = null
    })
})


module.exports = createNewImage
