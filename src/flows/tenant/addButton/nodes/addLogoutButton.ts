import { FunctionNode } from 'arkfbp/lib/functionNode'
import ButtonState from '@/admin/common/Button/ButtonState'
import { TablePage } from '@/admin/TablePage/TablePageState'

export class AddLoyoutButton extends FunctionNode {
  async run() {
    const pageState = this.inputs.state
    const state = pageState.state as TablePage

    const logoutButton: ButtonState = {
      label: '退出登录',
      type: 'danger',
      action: 'logout'
    }

    state.actions!['logout'] = [
      {
        name: 'flows/common/logout'
      }
    ]

    let buttons = state.card!.buttons
    if (!buttons) buttons = []
    buttons.push(logoutButton)

    return {
      state: pageState
    }
  }
}
