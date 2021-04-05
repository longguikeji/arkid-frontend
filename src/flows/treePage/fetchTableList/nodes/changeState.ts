import { FunctionNode } from 'arkfbp/lib/functionNode'

export class ChangeState extends FunctionNode {
  async run() {
    const state = this.$state.fetch()
    const data = this.inputs.data
    if (state.client.table.table) {
      state.client.table.table.data = []
      state.client.table.table.data = data.results
    }
  }
}
