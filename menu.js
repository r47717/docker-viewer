const { Menu, dialog } = require('electron')


function notImplemented() {
  dialog.showMessageBox({
    type: 'info',
    title: 'Info',
    message: 'This feature is not implemented yet',
    buttons: ["OK"]
  })
}


function createMenu(onNewContainer, onNewImage, onAbout) {
  onNewContainer = onNewContainer || notImplemented
  onNewImage = onNewImage || notImplemented
  onAbout = onAbout || notImplemented

  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'New Container...',
          click () { onNewContainer() }
        },
        {
          label: 'New Image...',
          click () { onNewImage() }
        },
        {type: 'separator'},
        {role: 'quit'}
      ]
    },
    {
      label: 'Edit',
      submenu: [
        {role: 'copy'}
      ]
    },
    {
      label: 'View',
      submenu: [
        {role: 'reload'},
        {role: 'toggledevtools'},
      ]
    },
    {
      role: 'help',
      submenu: [
        {
          label: 'Learn More about Electron',
          click () { require('electron').shell.openExternal('https://electron.atom.io') }
        }
      ]
    }
  ]

  return Menu.buildFromTemplate(template)
}


module.exports = createMenu