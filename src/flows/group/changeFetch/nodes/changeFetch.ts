import { FunctionNode } from 'arkfbp/lib/functionNode'

export class ChangeFetch extends FunctionNode {
  async run() {
    const state = this.inputs.state
    const fetchTableName = 'admin.adminState[1].state.actions.fetch'
    state[0].state.actions.fetch[0].name = 'flows/group/fetchTreeNode'
    state[0].state.actions.fetchTreeNodeChildren[0].name = 'flows/group/fetchTreeNodeChildren'
    state[0].state.actions.fetch.push(fetchTableName)
    state[0].state.actions.fetchTreeNodeChildren.push(fetchTableName)
    state[1].state.actions.fetch[0].name = 'flows/group/fetchTable'
    return {
      state: state
    }
  }
}
