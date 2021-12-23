import { FunctionNode } from 'arkfbp/lib/functionNode'

export class ChangeStateNode extends FunctionNode {
  async run() {
    const { state, page } = this.inputs
    const updateAction = state[page].state.actions?.update
    if (updateAction) {
      updateAction.push({
        name: 'arkfbp/flows/openapi'
      })
    }
  }
} 