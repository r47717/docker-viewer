const { dialog, ipcRenderer } = require('electron').remote
const api = require('../docker-api.js')
const btnRefresh = $("#btn-containers-refresh")

const updateContainerInfo = () => {
  const list = api.getRunningContainers()

  list.then(data => {
    const tbody = $("#containers-list");  
    tbody.html("")

    for (let container of data) {

      const buttonStartStop = (container.state === 'running') 
        ? `<button class="btn btn-sm btn-info pull-right btn-stop" title="Stop container">Stop</button>`
        : `<button class="btn btn-sm btn-info pull-right btn-start" title="Start container">Start</button>`

      tbody.append(
        `<tr id="${container.id}">
        <td><a href="#">${container.name}</a><button class="btn btn-sm btn-danger pull-right btn-delete" title="Delete container">Delete</button></td>
        <td>${container.image}</td>
        <td>${container.network}</td>
        <td>${container.state}${buttonStartStop}</td>
        </tr>`
      )
      
      $(`#${container.id} a`).click((e) => {
        e.preventDefault()
        e.stopPropagation()
        const elem = $(e.target).parent().parent()
        const id = elem.attr('id')

        api.getContainerInfo(id).then((info) => {
          let str = "";
          for (let param in info) {
            str += `${param}: ${info[param]}\n`
          }

          dialog.showMessageBox({
            type: 'info',
            title: 'Container Info',
            message: str
          })
        })
      })
      
      $(`#${container.id} button.btn-delete`).click((e) => {
        e.preventDefault()
        e.stopPropagation()
        const elem = $(e.target).parent().parent()
        const id = elem.attr('id')

        api.deleteContainer(id).then(() => {
          updateContainerInfo()
        })
      })
      
      $(`#${container.id} button.btn-start`).click((e) => {
        e.preventDefault()
        e.stopPropagation()
        const elem = $(e.target).parent().parent()
        const id = elem.attr('id')

        api.startContainer(id).then(() => {
          updateContainerInfo()
        })
      })
      
      $(`#${container.id} button.btn-stop`).click((e) => {
        e.preventDefault()
        e.stopPropagation()
        const elem = $(e.target).parent().parent()
        const id = elem.attr('id')

        api.stopContainer(id).then(() => {
          updateContainerInfo()
        })
      })

    }
    btnRefresh.html('Refresh')
  });
}


updateContainerInfo()


btnRefresh.click(() => {
  btnRefresh.html('Refreshing...')
  updateContainerInfo()
})

