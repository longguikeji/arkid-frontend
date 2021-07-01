import { FunctionNode } from 'arkfbp/lib/functionNode'
import ButtonState from '@/admin/common/Button/ButtonState'
import { TablePage } from '@/admin/TablePage/TablePageState'

export class AddLoyoutButton extends FunctionNode {
  async run() {
    const state = this.inputs.tempState
    const tempState = state.state as TablePage
    const logoutButton: ButtonState = {
      label: '退出登录',
      type: 'danger',
      action: 'logout'
    }

    tempState.actions!['logout'] = [
      {
        name: 'flows/user/logout'
      }
    ]

    let buttons = tempState.card!.buttons
    if (!buttons) buttons = []
    buttons.push(logoutButton)

    return {
      tempState: state
    }
  }
}
