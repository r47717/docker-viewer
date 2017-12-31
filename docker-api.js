const { Docker } = require('node-docker-api');

const docker = new Docker({ socketPath: '/var/run/docker.sock' });


async function getSysInfo() {
  const info = await docker.info()
  console.log(info)
  
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


async function getRunningContainers() {
  const containers = await docker.container.list();
  const list = []
  for (let container of containers) {
    console.log(container)
    list.push({
      name: container.data.Names[0],
      id: container.data.Id,
      image: container.data.Image,
      network: Object.keys(container.data.NetworkSettings.Networks)[0]
    })
  }

  return list
}


async function getContainerInfo(id) {
  const containers = await docker.container.list();

  for (let container of containers) {
    if (id === container.data.Id) {
      return {
        name: container.data.Names[0],
        id: container.data.Id,
        image: container.data.Image,
        network: Object.keys(container.data.NetworkSettings.Networks)[0]
      }
    }
  }

  return {}
}


module.exports = {
  getSysInfo,
  getRunningContainers,
  getContainerInfo
}

