import { cloneDeep } from 'lodash'

export function proxyClientServer(clientServer: any, data: any) {
  let newClientServer = cloneDeep(clientServer)
  if (newClientServer) {
    Object.keys(newClientServer).forEach(key => {
      const item = newClientServer[key]
      if (typeof item === 'object') {
        const val = data[item?.value]
        if (val) {
          const selectClientServer = {
            ...item[val]
          }
          newClientServer[key] = item.value
          Object.assign(newClientServer, selectClientServer)
        }
      }
    })
    return newClientServer
  }
}
