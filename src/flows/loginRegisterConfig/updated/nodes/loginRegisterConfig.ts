import { FunctionNode } from 'arkfbp/lib/functionNode'
import { GlobalValueModule } from '@/store/modules/global-value'

export class LoginRegisterConfig extends FunctionNode {
  async run() {
    const tempState = this.inputs.state
    const saveConfig = (com) => {
      const value = com.state.value
      GlobalValueModule.setClosePageAutoLogout(value)
    }
    tempState.state.form.items.data.state.items.close_page_auto_logout.state.updated = saveConfig
  }
}