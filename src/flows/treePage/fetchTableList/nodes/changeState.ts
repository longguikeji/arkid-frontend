import { FunctionNode } from 'arkfbp/lib/functionNode'

export class ChangeState extends FunctionNode {
  async run() {
    const state = this.$state.fetch()
    const data = this.inputs.data
    const params = this.inputs.params
    const results: Array<any> = []
    data.results.forEach((result) => {
      if (result.groups) {
        result.groups.forEach((group) => {
          if (group.uuid === params.data.uuid) {
            results.push(result)
          }
        })
      }
    })
    if (state.client.table.table) {
      state.client.table.table.data = []
      state.client.table.table.data = results
    }
  }
}
