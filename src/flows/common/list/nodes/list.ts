import { FunctionNode } from 'arkfbp/lib/functionNode'

export class ListNode extends FunctionNode {
  async run() {
    const { results } = this.inputs
    const { client } = this.$state.fetch().inputs
    if (results) {
      const items = client.items
      results.forEach((result) => {
        items.push({
          value: result.uuid,
          label: result.title,
          data: result
        })        
      })
    }
  }
}