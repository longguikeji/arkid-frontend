import { APINode } from '@/arkfbp/nodes/apiNode'

export class AdjustDashboardNode extends APINode {
  async run() {
    this.url = '/api/v1/user/appdata/'
    this.method = 'PUT'
    const list = this.inputs.client.items
    if (list) {
      const data = new Array()
      for (let i = 0, len = list.length; i < len; i++) {
        const item = list[i].state
        data.push(item.uuid)
      }
      this.params = {
        data
      }
      await super.run()
    }
  }
}
