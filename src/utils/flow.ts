import { cloneDeep } from 'lodash'
import { isArray } from '@/utils/common'

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


export function isLackRequiredParams(params: any, required: any): boolean {
  let lackRequiredParams = false
  for (const r of required) {
    if (isArray(r)) {
      const childParams = params[r]
      lackRequiredParams = isLackRequiredParams(childParams, r)
      if (lackRequiredParams) break
    } else {
      if (params[r] === undefined) {
        lackRequiredParams = true
        break
      }
    }
  }
  return lackRequiredParams
}