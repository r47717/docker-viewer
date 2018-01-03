const { Docker } = require('node-docker-api');

const docker = new Docker({ socketPath: '/var/run/docker.sock' });


async function getSysInfo() {
  const info = await docker.info()
  //console.log(info)
  
  return {
    "version": info.ServerVersion,
    "containers": info.Containers,
    "containers paused": info.ContainersPaused,
    "containers running": info.ContainersRunning,
    "containers stopped": info.ContainersStopped,
    "images": info.Images,
    "operating system": info.OperatingSystem
  }
}


/**************** IMAGES ******************/


async function listImages() {
  const images = await docker.image.list({all: true})
  const list = []

  for (let image of images) {
    //console.log(image)
    list.push({
      id: image.data.Id,
      containers: image.data.Containers,
      created: image.data.Created,
      size: image.data.Size,
      labels: (image.data.Labels && image.data.Labels.length) ? image.data.Labels[0] : ''
    })
  }

  return list
}



async function getImageById(id) {
  const list = await docker.image.list({all: true})

  for (let image of list) {
    if (image.data.Id === id) {
      return image
    }
  }

  return null
}



async function getImageInfo(id) {
  const image = await getImageById(id)
  return image
}


async function deleteImage(id) {
  const image = await getImageById(id)
  return image.remove()
}


async function pullImage(data) {

}


async function createNewImage(data) {

}




/**************** CONTAINERS ******************/


async function listContainers() {
  const containers = await docker.container.list({all: true});
  const list = []
  for (let container of containers) { 
    //console.log(container)
    list.push({
      name: container.data.Names[0],
      id: container.data.Id,
      image: container.data.Image,
      network: Object.keys(container.data.NetworkSettings.Networks)[0],
      state: container.data.State
    })
  }

  return list
}


async function getContainerInfo(id) {
  const containers = await docker.container.list({all: true});

  for (let container of containers) {
    if (container.id === id) {
      return {
        name: container.data.Names[0],
        id: container.data.Id,
        image: container.data.Image,
        network: Object.keys(container.data.NetworkSettings.Networks)[0],
        state: container.data.State
      }
    }
  }

  return {}
}


async function createNewContainer(image, name, start = true) {
  const container = await docker.container.create({
    Image: image,
    name
  })

  if (start) {
    return container.start()
  }

  return container
}


async function deleteContainer(id) {
  const containers = await docker.container.list({all: true});

  for (let container of containers) {
    if (container.id === id) {
      return container.delete({force: true})
    }  
  }

  return false
}


async function startContainer(id) {
  const containers = await docker.container.list({all: true});

  for (let container of containers) {
    if (container.id === id) {
      return container.start()
    }  
  }

  return false
}


async function stopContainer(id) {
  const containers = await docker.container.list({all: true});

  for (let container of containers) {
    if (container.id === id) {
      return container.stop()
    }  
  }

  return false
}


module.exports = {
  getSysInfo,

  createNewImage,
  listImages,
  getImageInfo,
  pullImage,
  deleteImage,

  listContainers,
  getContainerInfo,
  createNewContainer,
  deleteContainer,
  startContainer,
  stopContainer
}

