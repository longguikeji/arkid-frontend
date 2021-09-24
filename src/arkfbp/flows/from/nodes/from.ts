import { FunctionNode } from 'arkfbp/lib/functionNode'
import { FlowModule } from '@/store/modules/flow'

export class FromNode extends FunctionNode {

  async run() {
    const { com, client, from, next } = this.inputs
    if (from) {
      const state = com.getAnyPageState(from)
      const data = state.state.data
      if (!data || data.length === 0) {
        FlowModule.stopRunFlow()
      } else {
        const node = state.state.tree.node || data[0]
        return node
      }
    } else {
      FlowModule.stopRunFlow()
    }
  }

}
