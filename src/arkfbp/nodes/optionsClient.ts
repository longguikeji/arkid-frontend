import { FunctionNode } from 'arkfbp/lib/functionNode'
import Filter from '@/utils/filter'

export class OptionClient extends FunctionNode {
  async run() {
    const state = this.$state.fetch()
    if (state.clientServer == null) {
      return this.inputs
    }
    
    Object.keys(state.clientServer).forEach((key) => {
      const ks = key.split('.')
      let tempC = state.client
      for (let i = 0; i < ks.length - 1; i++) {
        if (ks[i].includes('items[prop=')) {
          const res = Filter(ks[i], tempC)
          tempC = tempC['items'][res]
        } else if (ks[i].includes('columns[prop=')) {
          const col = Filter(ks[i], tempC)
          tempC = tempC['columns'][col]
        } else {
          tempC = tempC[ks[i]]
        }
      }
      const vs = state.clientServer[key].split('.')
      let tempS = this.inputs
      for (let i = 0; i  < vs.length - 1; i++) {
        tempS = tempS[vs[i]]
      }

      tempC[ks[ks.length - 1]] = tempS[vs[vs.length - 1]].map((option: any) => {
        return {
          value: option.id,
          label: option.title || option.name
        }
      });
    })

    return this.inputs
  }
}