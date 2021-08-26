import { FunctionNode } from 'arkfbp/lib/functionNode'
import AdminComponentState from '@/admin/common/AdminComponent/AdminComponentState'

export class ContactsSwitchNode extends FunctionNode {
  async run() {
    const { state, page } = this.inputs
    const pageState: AdminComponentState = state[page]
    pageState.state.actions.update.push({
      name: 'flows/common/updateOpenAPI'
    })
  }
}
