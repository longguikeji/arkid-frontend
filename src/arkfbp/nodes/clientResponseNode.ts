import { FunctionNode } from 'arkfbp/lib/functionNode'
import { proxyClientServer, stateFilter } from '@/utils/flow'

// 客户端响应节点
export class ClientResponseNode extends FunctionNode {
  async run() {
    // client 代表当前页面的 state
    // clientServer 代表需要进行响应的数据映射关系
    // data 代表刚刚请求的返回的数据内容 -- 只有fetch时才存在
    if (!this.$state.fetch().inputs) { return null }
    let { client, clientServer } = this.$state.fetch().inputs
    let data = this.inputs
    clientServer = proxyClientServer(clientServer, data)

    if (!clientServer || !client) {
      throw new Error('ClientResponseNode Error')
    }

    const keys = Object.keys(clientServer)
    const length = keys.length
    for (let i = 0; i < length; i++) {
      const key = keys[i]
      const splitKeys = key.split('.')
      const splitLength = splitKeys.length - 1
      let tempC = client
      for (let j = 0; j < splitLength; j++) {
        if (!tempC) break
        const splitKey = splitKeys[j]
        if (splitKey.indexOf('[') >= 0) {
          const idx = splitKey.indexOf('[')
          const firstKey = splitKey.substring(0, idx)
          const secondKey = stateFilter(splitKey, tempC)
          tempC = tempC[firstKey][secondKey]
        } else {
          tempC = tempC[splitKey]
        }
      }
      if (!tempC) continue
      const lastKey = splitKeys[splitLength]
      if (data) {
        const valueMapping = clientServer[key].split('.')
        let tempS = data
        const valueMappinglength = valueMapping.length - 1
        for (let k = 0; k < valueMappinglength; k++) {
          if (!tempS) break
          tempS = tempS[valueMapping[k]]
        }
        let value = tempS ? tempS[valueMapping[valueMappinglength]] : undefined
        if (value === undefined) {
          if (lastKey !== 'value' && lastKey !== 'data') { value = clientServer[key] }
          if (lastKey === 'data') { value = tempS }
        }
        tempC[lastKey] = lastKey === 'disabled' ? !value : value
      } else {
        const value = (clientServer[key] !== undefined && clientServer[key] !== '') ? clientServer[key] : tempC[lastKey]
        tempC[lastKey] = value
      }
    }
  }
}
