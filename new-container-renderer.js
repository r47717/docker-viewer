const $ = jQuery = require('jquery')
require('bootstrap')
const { ipcRenderer } = require('electron')

const containerName = $('input[name="container-name"]')
const imageName = $('input[name="image-name"]')
const containerStart = $('input[name="container-start"]')
const btnCancel = $("#btn-cancel")
const btnCreate = $("#btn-create")


btnCancel.click(() => {
  ipcRenderer.send('new-container-dialog-cancel', '')
})


btnCreate.click(() => {
  ipcRenderer.send('new-container-dialog-create', JSON.stringify({
    imageName: imageName.val(),
    containerName: containerName.val(),
    containerStart: containerStart.is(':checked')
  }))
})


imageName.on('input', () => {
  if (imageName.val().trim() && containerName.val().trim()) {
    btnCreate.attr('disabled', false)
  } else {
    btnCreate.attr('disabled', true)
  }
})


containerName.on('input', () => {
  if (imageName.val().trim() && containerName.val().trim()) {
    btnCreate.attr('disabled', false)
  } else {
    btnCreate.attr('disabled', true)
  }
})