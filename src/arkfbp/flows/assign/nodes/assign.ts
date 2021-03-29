import { FunctionNode } from 'arkfbp/lib/functionNode'
import Filter from '@/utils/filter'
export class Assign extends FunctionNode {
  async run() {
    if (this.inputs === null) {
      return this.inputs
    }
    Object.keys(this.inputs.clientServer).forEach((key) => {
      const ks = key.split('.')
      let temp = this.inputs.client
      for (let i = 0; i < ks.length - 1; i++) {
        const k = ks[i]
        if (k.includes('items[prop=')) {
          const res = Filter(k, temp)
          temp = temp['items'][res]
        } else if (k.includes('columns[prop=')) {
          const col = Filter(k, temp)
          temp = temp['columns'][col]
        } else {
          temp = temp[k]
        }
      }
      temp[ks[ks.length - 1]] = this.inputs.clientServer[key]
      return this.inputs
    })
  }
}
