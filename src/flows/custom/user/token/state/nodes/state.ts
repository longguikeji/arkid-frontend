import { FunctionNode } from 'arkfbp/lib/functionNode'
import { ConfigModule } from '@/store/modules/config'
import { getToken } from '@/utils/auth'

export class ChangePageStateNode extends FunctionNode {

  async run() {
    const { state, page } = this.inputs
    const pageState = state[page].state
    pageState.card.title = 'Token管理'
    const isLookToken = ConfigModule.user.isLookToken
    const isManualOverdueToken = ConfigModule.user.isManualOverdueToken
    // add token input item content
    pageState.form.inline = true
    pageState.form.items.token = {
      type: 'Input',
      label: 'Token',
      state: {
        value: isLookToken ? getToken() : '*******',
        readonly: true
      }
    }
    // add refresh token action
    pageState.actions.token.push({
      name: 'flows/custom/user/token/refresh'
    })
    const button = pageState.buttons[0]
    if (button) {
      button.type = 'danger'
      if (!isManualOverdueToken) button.disabled = true
    }
  }

}