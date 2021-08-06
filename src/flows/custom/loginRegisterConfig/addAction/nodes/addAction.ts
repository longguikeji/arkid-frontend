import { FunctionNode } from 'arkfbp/lib/functionNode'
import AdminComponentState from '@/admin/common/AdminComponent/AdminComponentState'

export class AddAction extends FunctionNode {
  async run() {
    const { state, page } = this.inputs
    const pageState: AdminComponentState = state[page]
    const saveConfig = {
      name: 'flows/custom/loginRegisterConfig/saveConfig'
    }
    pageState.state.actions.fetch?.push(saveConfig)
  }
}
