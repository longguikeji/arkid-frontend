export function proxyClientServer(clientServer: any, data: any) {
  if (clientServer) {
    Object.keys(clientServer).forEach(key => {
      const item = clientServer[key]
      if (typeof item === 'object') {
        const val = data[item?.value]
        if (val) {
          const selectClientServer = {
            ...item[val]
          }
          clientServer[key] = item.value
          Object.assign(clientServer, selectClientServer)
        }
      }
    })
    return clientServer
  }
}
