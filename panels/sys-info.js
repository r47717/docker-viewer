
const api = require('../docker-api.js')

const info = api.getSysInfo()

info.then(data => {
  const panel = $("#system-info")

  for (let param in data) {
    const item = `<p><b>${param}</b>: ${data[param]}</p>`
    panel.append(item)
  }
})
