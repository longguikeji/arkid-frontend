import { FunctionNode } from 'arkfbp/lib/functionNode'
import AdminComponentState from '@/admin/common/AdminComponent/AdminComponentState'

export class AddAction extends FunctionNode {
  async run() {
    const { state, page } = this.inputs
    const pageState: AdminComponentState = state[page]
    const updatePasswordComplexify = {
      name: 'flows/custom/password/updatePasswordComplexify'
    }
    pageState.state.actions.fetch.push(updatePasswordComplexify)
  }
}