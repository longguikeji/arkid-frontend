import { FunctionNode } from 'arkfbp/lib/functionNode'

export class ChangePageStateNode extends FunctionNode {
  async run() {
    const { state, page } = this.inputs
    const actions = state[page].state?.actions
    if (!actions) return
    if (actions.switch) {
      actions.switch.push('fetch')
    }
    if (actions.enter) {
      actions.enter.push({
        name: 'flows/custom/subuser/enter'
      })
    }
  }
}