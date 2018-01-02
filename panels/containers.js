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
        `<tr>
        <td><a href="#" id="${container.id}">${container.name}</a></td>
        <td>${container.id}</td>
        <td>${container.image}</td>
        <td>${container.network}</td>
        </tr>`
      )
      $(`#${container.id}`).click((e) => {
        e.preventDefault()
        e.stopPropagation()
        const elem = $(e.target)
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
    }
    btnRefresh.html('Refresh')
  });
}


updateContainerInfo()


btnRefresh.click(() => {
  btnRefresh.html('Refreshing...')
  updateContainerInfo()
})

