import { FunctionNode } from 'arkfbp/lib/functionNode'
import { setButtonStatus } from '@/utils/btn'

export class ChangeState extends FunctionNode {
  async run() {
    const state = this.$state.fetch()
    const data = this.inputs
    state.client.table.data = []
    
    if (data.results !== undefined) {
      state.client.table.data = data.results
    } else {
      state.client.table.data = data
    }
    
    const buttons = state.client.card?.buttons
    if (state.client.table.data.length > 0) {
      setButtonStatus(buttons, false)
    } else {
      setButtonStatus(buttons, true)
    }

    if (data.count !== undefined) state.client.pagination.total = data.count

    return this.inputs
  }
}
