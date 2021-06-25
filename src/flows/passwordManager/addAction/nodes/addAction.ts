import { FunctionNode } from 'arkfbp/lib/functionNode'

export class AddAction extends FunctionNode {
  async run() {
    const tempState = this.inputs.state
    const updatePasswordComplexify = {
      name: 'flows/passwordManager/updatePasswordComplexify'
    }
    tempState.state.actions.fetch.push(updatePasswordComplexify)
  }
}