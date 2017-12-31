const api = require('../docker-api.js')

const list = api.getRunningContainers()

list.then(data => {
  const tbody = $("#containers-list");  
  for (let container of data) {
    tbody.append(
      `<tr>
      <td>${container.name}</td>
      <td>${container.id}</td>
      <td>${container.image}</td>
      <td>${container.network}</td>
      </tr>`
    )
  }
});