import { FunctionNode } from 'arkfbp/lib/functionNode'
import ButtonState from '@/admin/common/Button/ButtonState'
import TablePageState, { TablePage } from '@/admin/TablePage/TablePageState'
import { runFlowByFile } from '@/arkfbp/index'

export class AddLoyoutButton extends FunctionNode {
  async run() {
    const state = this.inputs.tempState as TablePageState
    const tempState = state.state as TablePage
    
    const logoutButton: ButtonState = {
      label: '退出登录',
      type: 'danger',
      action: async () => {
        await runFlowByFile('flows/user/logout', {
          router: this.inputs.com.$router
        })
      }
    }

    let buttons = tempState.card!.buttons
    if (!buttons) buttons = []
    buttons.push(logoutButton)

    return {
      tempState: state
    }
  }
}
