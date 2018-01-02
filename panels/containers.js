const { dialog, ipcRenderer } = require('electron').remote
const api = require('../docker-api.js')
const btnRefresh = $("#btn-containers-refresh")

const updateContainerInfo = () => {
  const list = api.getRunningContainers()

  list.then(data => {
    const tbody = $("#containers-list");  
    tbody.html("")

    for (let container of data) {
      tbody.append(
        `<tr id="${container.id}">
        <td><a href="#">${container.name}</a><button class="btn btn-sm btn-danger pull-right" title="Delete">X</button></td>
        <td>${container.id}</td>
        <td>${container.image}</td>
        <td>${container.network}</td>
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
      
      $(`#${container.id} button`).click((e) => {
        e.preventDefault()
        e.stopPropagation()
        const elem = $(e.target).parent().parent()
        const id = elem.attr('id')

        api.deleteContainer(id).then(() => {
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

