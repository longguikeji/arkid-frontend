import { FunctionNode } from 'arkfbp/lib/functionNode'
import AdminComponentState from '@/admin/common/AdminComponent/AdminComponentState'

export class AddAction extends FunctionNode {
  async run() {
    const { state, page } = this.inputs
    const pageState: AdminComponentState = state[page]
    const actions = pageState.state.actions
    const updateOpenAPI = {
      name: 'flows/common/updateOpenAPI'
    }
    actions.delete?.push(updateOpenAPI)
    actions.update?.push(updateOpenAPI)
    actions.create?.push(updateOpenAPI)
  }
}
