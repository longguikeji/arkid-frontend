import { FunctionNode } from 'arkfbp/lib/functionNode'
import { ConfigModule } from '@/store/modules/config'

export class ChangePageStateNode extends FunctionNode {

  async run() {
    const { state, page } = this.inputs
    const pageState = state[page].state
    // add logout action
    pageState.actions.logoff.push({
      name: 'flows/common/logout'
    })
    // control logoff button
    const buttons = pageState.descriptions.buttons
    const isLogout = ConfigModule.user.isLogout
    buttons.forEach(button => {
      if (button.action === 'logoff') {
        button.type = 'danger'
        if (!isLogout) {
          button.disabled = true
        }
      }
    })
  }

}