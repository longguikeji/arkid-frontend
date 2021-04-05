import { FunctionNode } from 'arkfbp/lib/functionNode'

export class ChangeState extends FunctionNode {
  async run() {
    const state = this.$state.fetch()
    const data = this.inputs
    state.client.table.data = []
    if (location.hash.includes('extension') || location.hash.includes('externalIdp')) {
      state.client.table.data = data
    } else {
      state.client.table.data = data.results
    }
    state.client.pagination.total = data.count
    return this.inputs
  }
}
