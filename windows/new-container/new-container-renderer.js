const $ = jQuery = require('jquery')
require('bootstrap')
const { ipcRenderer } = require('electron')
const api = require('../../docker-api')

const containerName = $('input[name="container-name"]')
const imageName = $('input[name="image-name"]')
const containerStart = $('input[name="container-start"]')
const btnCancel = $("#btn-cancel")
const btnCreate = $("#btn-create")
const selectImageNames = $("#select-image-names")


function getImageName() {
  const elem = selectImageNames.find(":selected")
  return elem ? elem.text() : null;
}


btnCancel.click(() => {
  ipcRenderer.send('new-container-dialog-cancel', '')
})


btnCreate.click(() => {
  const imageName = getImageName()
  if (imageName) {
    ipcRenderer.send('new-container-dialog-create', JSON.stringify({
      imageName: imageName,
      containerName: containerName.val(),
      containerStart: containerStart.is(':checked')
    }))
  }
})


containerName.on('input', () => {
  if (getImageName() && containerName.val().trim()) {
    btnCreate.attr('disabled', false)
  } else {
    btnCreate.attr('disabled', true)
  }
})


const imageTags = api.listImages().then((images) => {
  for (let image of images) {
    console.log(image.tag)
    selectImageNames.append(`<option>${image.tag}</option>`)
  }
})


