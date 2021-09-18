import { isArray, stringConvertNumber } from '@/utils/common'
import TreeNodeProps from '@/admin/common/data/Tree/TreeNodeProps'

export function proxyClientServer(clientServer: any, data?: any) {
  let proxyClientServer = {}
  Object.keys(clientServer).forEach(key => {
    const cs = clientServer[key]
    if (typeof cs === 'object') {
      const val = data ? data[cs.value] : cs.value || undefined 
      Object.assign(proxyClientServer, { [key]: cs.value })
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
  for (let i = 0, len = required.length; i < len; i++) {
    if (lackRequiredParams) break
    const r = required[i]
    let rs = r.split('.')
    let data = params
    for (let j = 0, l = rs.length; j < l; j++) {
      data = data[rs[j]]
      if (data === undefined || data === '') {
        lackRequiredParams = true
        break
      }
    }
  }
  return lackRequiredParams
}

export function stateFilter(strEquality: string, state: any): number | string {
  let secondKey: number | string = 0
  const leftBracketIndex = strEquality.indexOf('[')
  const rightBracketIndex = strEquality.indexOf(']')
  const arrayStateMapping = strEquality.slice(leftBracketIndex + 1, rightBracketIndex)
  if (arrayStateMapping.indexOf('=') < 0) {
    secondKey = stringConvertNumber(arrayStateMapping)
  } else {
    const arrayStateMappingSpilt = arrayStateMapping.split('=')
    const representKey = arrayStateMappingSpilt[0]
    const representValue = arrayStateMappingSpilt[1]
    const requiredStateKey = strEquality.substring(0, leftBracketIndex)
    const target = state[requiredStateKey]
    if (isArray(target)) {
      for (let i = 0, len = target.length; i < len; i++) {
        if (target[i][representKey] === representValue) {
          secondKey = i
          break
        }
      }
    }
  }
  return secondKey
}

export function getTreeData(data: Array<any>) {
  const res: Array<TreeNodeProps> = []
  for (let i = 0; i < data.length; i++) {
    const item = {
      id: data[i].uuid,
      uuid: data[i].uuid,
      label: data[i].name || '',
      children: data[i].children ? getTreeData(data[i].children) : [],
    }
    res.push(item)
  }
  return res
}
