import { FunctionNode } from 'arkfbp/lib/functionNode'
import Filter from '@/utils/filter'

export class ChangeState extends FunctionNode {
  async run() {
    const { client, clientServer } = this.$state.fetch()
    let data = this.inputs
    if (clientServer) {
      Object.keys(clientServer).forEach((key) => {
        const ks = key.split('.')
        let tempC = client
        for (let i = 0; i < ks.length - 1; i++) {
          if (ks[i].includes('items[prop=')) {
            const res = Filter(ks[i], tempC)
            tempC = tempC.items[res]
          } else if (ks[i].includes('columns[prop=')) {
            const col = Filter(ks[i], tempC)
            tempC = tempC.columns[col]
          } else {
            tempC = tempC[ks[i]]
          }
        }
        const vs = clientServer[key].split('.')
        let tempS = data
        for (let i = 0; i < vs.length - 1; i++) {
          tempS = tempS[vs[i]]
        }
        tempC[ks[ks.length - 1]] = tempS[vs[vs.length - 1]] || tempS
      })
    }
    return this.inputs
  }
}
