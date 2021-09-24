import { FunctionNode } from 'arkfbp/lib/functionNode'

export class ChangeProfilePageStateNode extends FunctionNode {
  async run() {
    const { state, page } = this.inputs
    state.$tabs = {
      value: 'profile',
      tabPosition: 'left',
      stretch: true,
      items: [
        {
          name: 'profile',
          label: '个人资料'
        },
        {
          name: 'password',
          label: '修改密码'
        }
      ]
    }
    const buttons = state[page].state.descriptions.buttons
    buttons.splice(1, 1)
  }
}