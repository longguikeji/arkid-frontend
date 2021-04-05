import { FunctionNode } from 'arkfbp/lib/functionNode'

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

    if (data.count !== undefined) state.client.pagination.total = data.count

    return this.inputs
  }
}
