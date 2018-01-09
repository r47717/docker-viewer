const api = require('../docker-api.js')
const btnRefresh = $("#btn-images-refresh")
const btnDeleteAll = $("#btn-images-delete-all")


const updateImageInfo = () => {
  const list = api.listImages()

  list.then(data => {
    const tbody = $("#images-list");  
    tbody.html("")

    for (let image of data) {

      const id = image.id.replace(':', '-')

      tbody.append(
        `<tr id="${id}">
        <td>${image.id}<button class="btn btn-sm btn-danger pull-right btn-delete" title="Delete image">Delete</button></td>
        <td>${image.tag}</td>
        <td>${image.created}</td>
        <td>${image.size}</td>
        <td>${image.containers}</td>
        </tr>`
      )

      $(`#${id} button.btn-delete`).click((e) => {
        e.preventDefault()
        e.stopPropagation()
        const elem = $(e.target).parent().parent()
        const id = elem.attr('id').replace('-', ':')

        api.getImageInfo(id).then((data) => {
          console.log(data)
        })

        api.deleteImage(id).then(() => {
          updateImageInfo()
        })
      })
      
    }

    btnRefresh.html('Refresh')
  });
}


updateImageInfo()


btnRefresh.click(() => {
  btnRefresh.html('Refreshing...')
  updateImageInfo()
})


btnDeleteAll.click(() => {
  api.deleteAllImages()
    .then(() => {
      updateImageInfo()
    })
    .catch(() => {
      updateImageInfo()
    })
})

