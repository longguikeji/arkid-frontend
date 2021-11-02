import { APINode } from '@/arkfbp/nodes/apiNode'

export class AppManageNode extends APINode {
  async run() {
    const { client, url, method } = this.inputs
    this.url = url
    this.method = method
    const outputs = await super.run()
    const items = {}
    const data = outputs?.data
    if (data && data.length > 0) {
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
      client.form.items = items
    }
  }
}
