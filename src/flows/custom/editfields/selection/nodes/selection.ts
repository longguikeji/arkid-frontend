import { FunctionNode } from 'arkfbp/lib/functionNode'

export class InitEditFieldsSelectionNode extends FunctionNode {
  async run() {
    const { com, previous } = this.inputs
    const selection = com.state?.table?.selection
    const results = previous.results
    if (selection && results) {
      results.forEach(result => {
        if (result.is_select) {
          selection.default.push(result)
          selection.values.push(result)
        }
      })
    }
  }
}
