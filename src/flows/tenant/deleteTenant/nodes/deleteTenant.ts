import { FunctionNode } from 'arkfbp/lib/functionNode'

export class DeleteTenant extends FunctionNode {
  async run() {
    const state = this.inputs.state
    const deleteAction = state.state.actions.delete
    deleteAction.pop()
    deleteAction.push({
      name: 'flows/user/logout'
    })
  }
}
