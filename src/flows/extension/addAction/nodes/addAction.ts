import { FunctionNode } from 'arkfbp/lib/functionNode'

export class AddAction extends FunctionNode {
  async run() {
    const state = this.inputs.state.state
    const updateOpenAPI = {
      name: 'flows/common/updateOpenAPI'
    }
    state.actions.update.push(updateOpenAPI)
    state.actions.delete.push(updateOpenAPI)
    state.actions.create.push(updateOpenAPI)
  }
}
