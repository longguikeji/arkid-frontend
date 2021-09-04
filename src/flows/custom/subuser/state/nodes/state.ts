import { FunctionNode } from 'arkfbp/lib/functionNode'

export class ChangePageStateNode extends FunctionNode {
  async run() {
    const { state, page } = this.inputs
    const actions = state[page].state.actions
    actions.switch.push('fetch')
    actions.enter.push({
      name: 'flows/custom/subuser/enter'
    })
  }
}