import { FunctionNode } from 'arkfbp/lib/functionNode'

export class Marketplace extends FunctionNode {
  async run() {
    const results = this.inputs
    const state = this.$state.fetch()
    if (results && results.length) {
      const items = state.inputs.client.items  
      for (let i = 0, len = results.length; i < len; i++) {
        const item = results[i] 
        items.push({
          type: 'ExtensionPanel',
          state: {
            ...item,
            data: item
          }
        })
      }
    }
  }
}