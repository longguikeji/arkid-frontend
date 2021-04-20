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
      if (data.results) {
        setButtonStatus(table?.buttons, false)
      } else {
        setButtonStatus(table?.buttons, true)
      }
    }
  }
}
