import { FunctionNode } from 'arkfbp/lib/functionNode'

export class GroupUser extends FunctionNode {
  async run() {
    const state = this.inputs.state
    state.state.actions.fetch[0].name = 'flows/group/fetchTable'
  }
}
