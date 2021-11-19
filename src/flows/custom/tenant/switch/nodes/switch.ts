import { FunctionNode } from 'arkfbp/lib/functionNode'

export class Switch extends FunctionNode {
  async run() {
    const { client, com } = this.inputs
    const data = com.state.data
    const state = com.getAnyPageState('tenant.switch')
    state.data = data
    const items = state.form.items
    for (const key in items) {
      items[key].state.value = data[key]
    }
    client.dialogs.switch.visible = true
  }
}
