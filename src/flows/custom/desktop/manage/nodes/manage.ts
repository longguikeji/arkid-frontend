import { APINode } from '@/arkfbp/nodes/apiNode'

export class AppManageNode extends APINode {
  async run() {
    const { client, url, method, com } = this.inputs
    this.url = url
    this.method = method
    const outputs = await super.run()
    const data = outputs?.data
    if (data && data.length > 0) {
      const state = com.getAnyPageState('app_manage')
      const items = {}
      data.forEach((app, index) => {
        items[`app${index}`] = {
          label: app.name,
          type: 'SwitchForm',
          prop: `app${index}`,
          state: {
            value: app.value || false,
            uuid: app.id || app.uuid,
            action: 'subscribe',
            data: app
          }
        }
      })
      state.form.items = items
    } else {
      const button = client.card.buttons[0]
      if (button) {
        button.disabled = true
      }
    }
  }
}
