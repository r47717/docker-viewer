const api = require('../../docker-api.js')


const updateSysInfo = () => {
  const info = api.getSysInfo()

  info.then(data => {
    const panel = $("#system-info")
    panel.html("")

    for (let param in data) {
      const item = `<p><b>${param}</b>: ${data[param]}</p>`
      panel.append(item)
    }
  })
}


updateSysInfo()


$("#btn-sys-info-refresh").click(() => {
  updateSysInfo()
})