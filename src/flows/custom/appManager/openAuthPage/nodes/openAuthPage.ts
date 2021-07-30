import { FunctionNode } from 'arkfbp/lib/functionNode'

export class OpenAuthPage extends FunctionNode {
  async run() {
    const state = this.inputs.client
    const data = this.inputs.com.state.data
    const auth = state.dialogs.auth
    auth.data = data
    auth.visible = true
  }
}
