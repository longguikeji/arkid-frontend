import { FunctionNode } from 'arkfbp/lib/functionNode'

export class Group extends FunctionNode {
  async run() {
    const state = this.inputs.state
    const fetchTableName = 'admin.adminState[1].state.actions.fetch'
    state.state.actions.fetch.push(fetchTableName)
    state.state.actions.fetchTreeNode.push(fetchTableName)
  }
}
