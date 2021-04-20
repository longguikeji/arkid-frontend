import { FunctionNode } from 'arkfbp/lib/functionNode'
import { setButtonStatus } from '@/utils/btn'

export class ChangeState extends FunctionNode {
  async run() {
    const state = this.$state.fetch()
    const data = this.inputs.data
    const table = state.client?.table?.table
    if (table) {
      table.data = []
      table.data = data.results
      const buttons = state.client?.table?.card?.buttons
      if (data.results) {
        setButtonStatus(buttons, false)
      } else {
        setButtonStatus(buttons, true)
      }
    }
  }
}
