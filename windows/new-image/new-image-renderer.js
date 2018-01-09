const $ = jQuery = require('jquery')
require('bootstrap')
const { ipcRenderer } = require('electron')
const api = require('../../docker-api')

const imageName = $('input[name="image-name"]')
const btnCancel = $("#btn-cancel")
const btnCreate = $("#btn-create")


btnCancel.click(() => {
  ipcRenderer.send('new-image-dialog-cancel', '')
})


btnCreate.click(() => {
  btnCreate.attr('disabled', true)	
  ipcRenderer.send('new-image-dialog-create', JSON.stringify({
    imageName: imageName.val()
  }))
})


imageName.on('input', () => {
  if (imageName.val().trim()) {
    btnCreate.attr('disabled', false)
  } else {
    btnCreate.attr('disabled', true)
  }
})
