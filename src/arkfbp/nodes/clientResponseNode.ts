import { FunctionNode } from 'arkfbp/lib/functionNode'
import { proxyClientServer, stateFilter } from '@/utils/flow'
import { setOptions } from '@/utils/options'

export class ClientResponseNode extends FunctionNode {
  async run() {
    if (!this.$state.fetch().inputs) { return null }
    let { client, clientServer, data: depData } = this.$state.fetch().inputs
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
        if (tempC.options) setOptions(tempC)
      } else {
        if (lastKey === 'data') {
          tempC[lastKey] = depData
        } else {
          tempC[lastKey] = clientServer[key]
        }
      }
    }

    return this.inputs
  }
}
