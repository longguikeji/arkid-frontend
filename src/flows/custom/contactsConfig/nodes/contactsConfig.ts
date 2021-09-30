import { FunctionNode } from 'arkfbp/lib/functionNode'

export class ChangeContactsConfigPageStateNode extends FunctionNode {
  async run() {
    const { state } = this.inputs
    state.$tabs = {
      value: 'contacts_switch',
      tabPosition: 'left',
      stretch: true,
      items: [
        {
          name: 'contacts_switch',
          label: '通讯录开关'
        },
        {
          name: 'contacts_group_config',
          label: '组的可见性'
        },
        {
          name: 'contacts_user_config',
          label: '个人字段可见性'
        }
      ]
    }
  }
}