import { FunctionNode } from 'arkfbp/lib/functionNode'

export class ChangeState extends FunctionNode {
  async run() {
    const state = this.$state.fetch()
    const data = this.inputs
    const items = state.client.form?.items
    if (items) {
      Object.keys(items).forEach(key => {
        items[key].state.value = data[key]
      })
    }
    return this.inputs
  }
}
