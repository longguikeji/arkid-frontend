import { isArray } from '@/utils/common'

export function proxyClientServer(clientServer: any, data?: any) {
  let proxyClientServer = {}
  Object.keys(clientServer).forEach(key => {
    const cs = clientServer[key]
    if (typeof cs === 'object') {
      const val = data ? data[cs.value] : undefined
      if (val) {
        Object.assign(proxyClientServer, cs[val])
      } else {
        delete cs.value
        const enums = Object.keys(cs)
        for (let i = 0, len = enums.length; i < len; i++) {
          Object.assign(proxyClientServer, cs[enums[i]])
        }
      }
    } else {
      proxyClientServer[key] = cs
    }
  })
  return proxyClientServer
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