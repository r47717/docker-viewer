const { Menu, dialog } = require('electron')


function notImplemented() {
  dialog.showMessageBox({
    type: 'info',
    title: 'Info',
    message: 'This feature is not implemented yet',
    buttons: ["OK"]
  })
}


function createMenu(onNewImage, onNewContainer, onAbout) {
  onNewImage = onNewImage || notImplemented
  onNewContainer = onNewContainer || notImplemented
  onAbout = onAbout || notImplemented

  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'New Image...',
          click () { onNewImage() }
        },
        {
          label: 'New Container...',
          click () { onNewContainer() }
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